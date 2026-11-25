import { Request, Response } from "express";
import razorpay from "../config/razorpay";
import crypto from "crypto";
import OrderMaster from "../Models/OrderMaster";
import UserMaster from "../Models/userMaster";
import { sendOrderPlacedEmail, sendPaymentReceiptEmail } from "../Services/EmailService";
import {
    GetCartTotalForUser,
    OrderPlacementError,
    PlaceOrderForUser
} from "../Services/OrderMasterServices";

const refundPayment = async (paymentId: string, amount: number) => {
    try {
        await razorpay.payments.refund(paymentId, { amount });
        return true;
    } catch (error) {
        console.error("Could not refund a verified payment:", error);
        return false;
    }
};

const sendOrderEmails = async (userId: string, order: any) => {
    try {
        const user = await UserMaster.findById(userId).select("email name");
        const email = user?.email?.trim();
        if (!email) return;

        const items = Array.isArray(order?.items)
            ? order.items.map((item: any) => {
                const product = item?.product_ID && typeof item.product_ID === "object" ? item.product_ID : null;
                return {
                    name: String(product?.Name || "Product"),
                    quantity: Number(item?.Quantity) || 0,
                    price: Number(item?.Price) || 0
                };
            })
            : [];

        const details = {
            email,
            customerName: user?.name || undefined,
            userId: String(userId),
            orderId: String(order?._id || ""),
            trackingId: order?.TrackingId ? String(order.TrackingId) : undefined,
            paymentId: order?.RazorpayPaymentId ? String(order.RazorpayPaymentId) : undefined,
            subtotal: Number(order?.SubTotal) || 0,
            shippingCharge: Number(order?.ShippingCharge) || 0,
            total: Number(order?.Total) || 0,
            items,
            placedAt: order?.createdAt
        };

        const results = await Promise.allSettled([
            sendOrderPlacedEmail(details),
            sendPaymentReceiptEmail(details)
        ]);

        results.forEach((result, index) => {
            if (result.status === "rejected") {
                const label = index === 0 ? "order confirmation" : "payment receipt";
                console.error(`Could not send ${label} email:`, result.reason);
            }
        });
    } catch (error) {
        console.error("Could not send order emails:", error);
    }
};

export const createOrder = async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Authentication is required to start checkout."
        });
    }

    try {
        const total = await GetCartTotalForUser(userId);
        const amount = Math.round(total * 100);
        if (!Number.isSafeInteger(amount) || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "The cart total is invalid."
            });
        }

        const options = {
            amount,
            currency: "INR",
            receipt: `rd_${userId.slice(-8)}_${Date.now()}`,
            notes: { userId }
        };

        const order = await razorpay.orders.create(options);
        const key = process.env.RAZORPAY_KEY_ID;
        if (!key) {
            throw new Error("Razorpay key ID is not configured.");
        }

        return res.status(200).json({
            success: true,
            message: "Razorpay order created successfully",
            data: {
                order: {
                    id: order.id,
                    amount: order.amount,
                    currency: order.currency
                },
                key
            }
        });

    } catch (error) {
        console.error("Razorpay order error:", error);
        const statusCode = error instanceof OrderPlacementError ? error.statusCode : 500;
        return res.status(statusCode).json({
            success: false,
            message: error instanceof Error ? error.message : "Unable to create payment order."
        });
    }
};

//Verify Payment
export const verifyPayment = async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: "Authentication is required to verify payment."
        });
    }

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = req.body;

        if (
            typeof razorpay_order_id !== "string" ||
            typeof razorpay_payment_id !== "string" ||
            typeof razorpay_signature !== "string" ||
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !/^[a-f\d]{64}$/i.test(razorpay_signature)
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing payment details",
            });
        }

        const keySecret = process.env.RAZORPAY_KEY_SECRET;
        if (!keySecret) {
            return res.status(503).json({
                success: false,
                message: "Payment verification is not configured."
            });
        }

        const body =
            `${razorpay_order_id}|${razorpay_payment_id}`;

        const expectedSignature = crypto
            .createHmac(
                "sha256",
                keySecret
            )
            .update(body)
            .digest("hex");

        const signatureBuffer = Buffer.from(
            expectedSignature,
            "hex"
        );
        const receivedBuffer = Buffer.from(
            razorpay_signature,
            "hex"
        );
        const signatureBytes = new Uint8Array(new ArrayBuffer(signatureBuffer.length));
        signatureBytes.set(signatureBuffer);
        const receivedBytes = new Uint8Array(new ArrayBuffer(receivedBuffer.length));
        receivedBytes.set(receivedBuffer);

        const isValid =
            signatureBytes.length === receivedBytes.length &&
            crypto.timingSafeEqual(
                signatureBytes,
                receivedBytes
            );

        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
            });
        }

        const paymentOrder = await razorpay.orders.fetch(razorpay_order_id);
        if (paymentOrder.notes?.userId !== userId) {
            return res.status(403).json({
                success: false,
                message: "This payment order does not belong to your account."
            });
        }
        const paymentAmount = paymentOrder.amount;
        if (
            typeof paymentAmount !== "number" ||
            !Number.isSafeInteger(paymentAmount) ||
            paymentAmount <= 0
        ) {
            return res.status(502).json({
                success: false,
                message: "Razorpay returned an invalid payment amount."
            });
        }

        const existingOrder = await OrderMaster.findOne({
            RazorpayPaymentId: razorpay_payment_id,
            user_id: userId,
            isDeleted: false
        });
        if (existingOrder) {
            return res.status(200).json({
                success: true,
                message: "Payment was already verified.",
                data: existingOrder
            });
        }

        let cartTotal: number;
        try {
            cartTotal = await GetCartTotalForUser(userId);
        } catch (error) {
            const refunded = await refundPayment(
                razorpay_payment_id,
                paymentAmount
            );
            const message = error instanceof Error
                ? error.message
                : "Could not validate your cart.";
            return res.status(refunded ? 409 : 500).json({
                success: false,
                message: refunded
                    ? `${message} A refund has been initiated.`
                    : `Payment was received but could not be refunded automatically. Contact support with payment ID ${razorpay_payment_id}.`
            });
        }
        const expectedAmount = Math.round(cartTotal * 100);
        if (
            !Number.isSafeInteger(expectedAmount) ||
            expectedAmount !== paymentAmount ||
            paymentOrder.currency !== "INR"
        ) {
            const refunded = await refundPayment(
                razorpay_payment_id,
                paymentAmount
            );
            return res.status(refunded ? 409 : 500).json({
                success: false,
                message: refunded
                    ? "The cart changed during payment. A refund has been initiated."
                    : `Payment was received but could not be refunded automatically. Contact support with payment ID ${razorpay_payment_id}.`
            });
        }

        let order;
        try {
            order = await PlaceOrderForUser(
                userId,
                razorpay_payment_id,
                paymentAmount
            );
        } catch (error) {
            const refunded = await refundPayment(
                razorpay_payment_id,
                paymentAmount
            );
            const errorMessage = error instanceof Error
                ? error.message
                : "Could not place your order.";
            return res.status(refunded ? 409 : 500).json({
                success: false,
                message: refunded
                    ? `${errorMessage} A refund has been initiated.`
                    : `Payment was received but the order could not be placed or refunded automatically. Contact support with payment ID ${razorpay_payment_id}.`
            });
        }

        await sendOrderEmails(userId, order);

        return res.status(200).json({
            success: true,
            message: "Payment signature verified successfully",
            data: order
        });

    } catch (error) {
        console.error("Payment verification error:", error);
        const statusCode = error instanceof OrderPlacementError ? error.statusCode : 500;
        return res.status(statusCode).json({
            success: false,
            message: error instanceof Error ? error.message : "Payment verification failed."
        });
    }
};