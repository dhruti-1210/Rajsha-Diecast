import { randomBytes } from "crypto";
import Checkout, { ICheckout } from "../Models/CheckoutModel";
import OrderLineMaster from "../Models/OrderLineMaster";
import OrderMaster from "../Models/OrderMaster";
import TransactionHistory from "../Models/TransactionHistoryMaster";

// Create Checkout
export const CreateCheckout = async (
    data: Partial<ICheckout>
) => {
    try {
        const checkout = await Checkout.create(data);
        return checkout;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Checkout
export const GetAllCheckout = async () => {
    try {
        const checkouts = await Checkout.find()
            .populate({
                path: "order_Master_id",
                populate: {
                    path: "user_id",
                    select: "name email mobile address _id"
                }
            })
            .sort({ createdAt: -1 })
            .lean();

        const orderIds = checkouts
            .map((checkout) => {
                const order = checkout.order_Master_id;
                return order && typeof order === "object" && "_id" in order
                    ? (order as any)._id
                    : null;
            })
            .filter((orderId): orderId is NonNullable<typeof orderId> => orderId !== null);

        const [orderLines, transactions] = await Promise.all([
            OrderLineMaster.find({
                order_Master_id: { $in: orderIds },
                isDeleted: false
            }).populate("product_ID", "Name ModelCode BrandName Image").lean(),
            TransactionHistory.find({
                order_Master_id: { $in: orderIds },
                isDeleted: false
            }).populate("user_id", "name email mobile address _id").sort({ createdAt: -1 }).lean()
        ]);

        const orderLinesByOrderId = new Map<string, typeof orderLines>();
        for (const orderLine of orderLines) {
            const orderId = orderLine.order_Master_id.toString();
            const lines = orderLinesByOrderId.get(orderId) ?? [];
            lines.push(orderLine);
            orderLinesByOrderId.set(orderId, lines);
        }

        const transactionsByOrderId = new Map<string, typeof transactions>();
        for (const transaction of transactions) {
            const orderId = transaction.order_Master_id?.toString();
            if (!orderId) continue;
            const current = transactionsByOrderId.get(orderId) ?? [];
            current.push(transaction);
            transactionsByOrderId.set(orderId, current);
        }

        return checkouts.map((checkout) => {
            const order = checkout.order_Master_id;
            const orderObject = order && typeof order === "object" && "_id" in order
                ? (order as any)
                : null;
            if (!orderObject) return checkout;
            const orderId = orderObject._id.toString();
            return {
                ...checkout,
                order_Master_id: {
                    ...orderObject,
                    items: orderLinesByOrderId.get(orderId) ?? [],
                    transactions: transactionsByOrderId.get(orderId) ?? []
                }
            };
        });
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Checkout By ID
export const GetCheckoutById = async (id: string) => {
    try {
        const checkout = await Checkout.findById(id)
            .populate({
                path: "order_Master_id",
                populate: {
                    path: "user_id",
                    select: "name email mobile address _id"
                }
            })
            .lean();

        if (!checkout) return null;

        const order = checkout.order_Master_id;
        const orderObject = order && typeof order === "object" && "_id" in order
            ? (order as any)
            : null;
        if (!orderObject) return checkout;

        const orderId = orderObject._id;
        const [orderLines, transactions] = await Promise.all([
            OrderLineMaster.find({
                order_Master_id: orderId,
                isDeleted: false
            }).populate("product_ID", "Name ModelCode BrandName Image").lean(),
            TransactionHistory.find({
                order_Master_id: orderId,
                isDeleted: false
            }).populate("user_id", "name email mobile address _id").sort({ createdAt: -1 }).lean()
        ]);

        return {
            ...checkout,
            order_Master_id: {
                ...orderObject,
                items: orderLines,
                transactions
            }
        };
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Checkout Status
export const UpdateCheckoutStatus = async (
    id: string,
    status: string,
    updatedBy: string
) => {
    try {
        const statusStages = [
            "isPLACED",
            "isPROCESSING",
            "isSHIPPED",
            "isTransist",
            "isDELIVERED"
        ];

        const statusIndex = statusStages.indexOf(status);

        if (statusIndex === -1) {
            throw new Error("Invalid checkout status");
        }

        const statusUpdate: any = {};

        statusStages.forEach((stage, index) => {
            statusUpdate[stage] = index <= statusIndex;
        });

        const existingCheckout = await Checkout.findById(id).select("order_Master_id");
        if (!existingCheckout) {
            return null;
        }

        const checkout = await Checkout.findByIdAndUpdate(
            id,
            {
                ...statusUpdate,
                updatedBy,
                updatedAt: new Date()
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!checkout) {
            return null;
        }

        if (statusIndex >= statusStages.indexOf("isSHIPPED")) {
            await OrderMaster.findOneAndUpdate(
                {
                    _id: existingCheckout.order_Master_id,
                    TrackingId: { $in: ["", null] }
                },
                {
                    TrackingId: `RD-${randomBytes(6).toString("hex").toUpperCase()}`,
                    updatedBy,
                    updatedAt: new Date()
                },
                { new: true }
            );
        }

        return Checkout.findById(id).populate("order_Master_id");
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Soft Delete Checkout
export const DeleteCheckout = async (id: string) => {
    try {
        const checkout = await Checkout.findByIdAndUpdate(
            id,
            { isDeleted: true, updatedAt: new Date() },
            { new: true }
        );
        return checkout;
    } catch (error: any) {
        throw new Error(error.message);
    }
};