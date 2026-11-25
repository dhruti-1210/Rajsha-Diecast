import nodemailer from "nodemailer";

export class EmailConfigurationError extends Error {}

export class EmailDeliveryError extends Error {}

type OrderEmailItem = {
    name: string;
    quantity: number;
    price: number;
};

type OrderEmailDetails = {
    email: string;
    customerName?: string;
    userId?: string;
    orderId: string;
    trackingId?: string;
    paymentId?: string;
    subtotal: number;
    shippingCharge: number;
    total: number;
    items: OrderEmailItem[];
    placedAt?: Date | string;
};

const getSmtpConfig = () => {
    const host = process.env.SMTP_HOST?.trim();
    const port = Number(process.env.SMTP_PORT);
    const from = process.env.SMTP_FROM?.trim();
    const user = process.env.SMTP_USER?.trim();
    const password = process.env.SMTP_PASSWORD;

    if (!host || !Number.isInteger(port) || port <= 0 || !from) {
        throw new EmailConfigurationError(
            "Email delivery is not configured. Set the SMTP environment variables."
        );
    }

    if (Boolean(user) !== Boolean(password)) {
        throw new EmailConfigurationError(
            "Both SMTP_USER and SMTP_PASSWORD must be configured together."
        );
    }

    return {
        from,
        transport: nodemailer.createTransport({
            host,
            port,
            secure: process.env.SMTP_SECURE === "true" || port === 465,
            ...(user && password ? { auth: { user, pass: password } } : {})
        })
    };
};

const sendEmail = async (to: string, subject: string, text: string, html: string) => {
    const { from, transport } = getSmtpConfig();
    try {
        await transport.sendMail({ from, to, subject, text, html });
    } catch (error) {
        console.error(
            "SMTP email delivery failed:",
            error instanceof Error ? error.message : "Unknown SMTP error"
        );
        throw new EmailDeliveryError("Unable to send the email.");
    }
};

const formatInr = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(Number.isFinite(value) ? value : 0);

const formatDate = (value?: Date | string) => {
    const date = value ? new Date(value) : new Date();
    return Number.isNaN(date.getTime()) ? new Date().toLocaleString("en-IN") : date.toLocaleString("en-IN");
};

const escapeHtml = (value: string) =>
    value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");

const renderItemsRows = (items: OrderEmailItem[]) =>
    items.map((item) => {
        const name = escapeHtml(item.name || "Product");
        const quantity = Number.isFinite(item.quantity) ? item.quantity : 0;
        const price = Number.isFinite(item.price) ? item.price : 0;
        const lineTotal = price * quantity;
        return `<tr>
            <td style="padding:8px;border:1px solid #ddd;">${name}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:center;">${quantity}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right;">${formatInr(price)}</td>
            <td style="padding:8px;border:1px solid #ddd;text-align:right;">${formatInr(lineTotal)}</td>
        </tr>`;
    }).join("");

const formatDisplayOrderId = (orderId: string) => {
    const normalized = orderId.trim();
    if (!normalized) return "N/A";
    return `#${normalized.slice(-8).toUpperCase()}`;
};

const renderOrderSummary = (details: OrderEmailDetails, options?: { includeUserId?: boolean; includeEmail?: boolean }) => {
    const customerName = escapeHtml(details.customerName?.trim() || "Customer");
    const orderId = escapeHtml(formatDisplayOrderId(details.orderId));
    const trackingId = escapeHtml(details.trackingId || "N/A");
    const paymentId = escapeHtml(details.paymentId || "N/A");
    const placedAt = escapeHtml(formatDate(details.placedAt));
    const shippingLabel = details.shippingCharge > 0 ? formatInr(details.shippingCharge) : "Free";
    // const userId = escapeHtml(details.userId || "N/A");
    const email = escapeHtml(details.email || "N/A");
    // const userIdLine = options?.includeUserId ? `<strong>User ID:</strong> ${userId}<br/>` : "";
    const emailLine = options?.includeEmail ? `<strong>Email:</strong> ${email}<br/>` : "";

    return `
        <p>Hi ${customerName},</p>

        <p><strong>Order ID:</strong> ${orderId}<br/>
       ${emailLine}<strong>Tracking ID:</strong> ${trackingId}<br/>
        <strong>Payment ID:</strong> ${paymentId}<br/>
        <strong>Date:</strong> ${placedAt}</p>
        <table style="border-collapse:collapse;width:100%;max-width:640px;">
            <thead>
                <tr>
                    <th style="padding:8px;border:1px solid #ddd;text-align:left;">Item</th>
                    <th style="padding:8px;border:1px solid #ddd;text-align:center;">Qty</th>
                    <th style="padding:8px;border:1px solid #ddd;text-align:right;">Price</th>
                    <th style="padding:8px;border:1px solid #ddd;text-align:right;">Total</th>
                </tr>
            </thead>
            <tbody>${renderItemsRows(details.items)}</tbody>
        </table>
        <p style="margin-top:16px;">
            <strong>Subtotal:</strong> ${formatInr(details.subtotal)}<br/>
            <strong>Shipping:</strong> ${shippingLabel}<br/>
            <strong>Total:</strong> ${formatInr(details.total)}
        </p>
    `;
};

export const sendOtpEmail = async (email: string, otp: string) => {
    try {
        await sendEmail(
            email,
            "Your Rajsha Diecast verification code",
            `Your verification code is ${otp}. It expires in 10 minutes.`,
            `<p>Your Rajsha Diecast verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:6px">${escapeHtml(otp)}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>`
        );
    } catch (error) {
        if (error instanceof EmailConfigurationError) throw error;
        throw new EmailDeliveryError("Unable to send the verification email.");
    }
};

export const sendOrderPlacedEmail = async (details: OrderEmailDetails) => {
    const displayOrderId = formatDisplayOrderId(details.orderId);
    const summary = renderOrderSummary(details);
    const text = `Hi ${details.customerName?.trim() || "Customer"}, your order ${displayOrderId} has been placed successfully. Tracking ID: ${details.trackingId || "N/A"}. Total: ${formatInr(details.total)}.`;
    const html = `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#222;">
            <h2 style="margin-bottom:8px;">Your order has been placed</h2>
            <p>Thank you for shopping with Rajsha Diecast. We have received your order.</p>
            ${summary}
            <p>We will notify you when your order status changes.</p>
        </div>
    `;
    await sendEmail(details.email, `Order placed `, text, html);
};

export const sendPaymentReceiptEmail = async (details: OrderEmailDetails) => {
    const displayOrderId = formatDisplayOrderId(details.orderId);
    const summary = renderOrderSummary(details, { includeUserId: true, includeEmail: true });
    const text = `Hi ${details.customerName?.trim() || "Customer"}, we received your payment for order ${displayOrderId}. User ID: ${details.userId || "N/A"}. Email: ${details.email}. Payment ID: ${details.paymentId || "N/A"}. Total: ${formatInr(details.total)}.`;
    const html = `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#222;">
            <h2 style="margin-bottom:8px;">Payment receipt</h2>
            <p>We have received your payment successfully. Please keep this receipt for your records.</p>
            ${summary}
        </div>
    `;
    await sendEmail(details.email, `Payment receipt - ${displayOrderId}`, text, html);
};
