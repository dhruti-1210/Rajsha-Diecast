import nodemailer from "nodemailer";

export class EmailConfigurationError extends Error {}

export class EmailDeliveryError extends Error {}

export const sendOtpEmail = async (email: string, otp: string) => {
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

    const transport = nodemailer.createTransport({
        host,
        port,
        secure: process.env.SMTP_SECURE === "true" || port === 465,
        ...(user && password ? { auth: { user, pass: password } } : {})
    });

    try {
        await transport.sendMail({
            from,
            to: email,
            subject: "Your Rajsha Diecast verification code",
            text: `Your verification code is ${otp}. It expires in 10 minutes.`,
            html: `<p>Your Rajsha Diecast verification code is:</p><p style="font-size:24px;font-weight:bold;letter-spacing:6px">${otp}</p><p>This code expires in 10 minutes. If you did not request it, you can ignore this email.</p>`
        });
    } catch (error) {
        console.error(
            "SMTP email delivery failed:",
            error instanceof Error ? error.message : "Unknown SMTP error"
        );
        throw new EmailDeliveryError("Unable to send the verification email.");
    }
};
