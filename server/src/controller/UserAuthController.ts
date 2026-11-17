import { Request, Response } from "express";
import {
    getUserSession,
    logoutUser,
    requestUserOtp,
    saveUserProfile,
    UserAuthError,
    verifyUserOtp
} from "../Services/UserAuthServices";
import {
    EmailConfigurationError,
    EmailDeliveryError
} from "../Services/EmailService";

const SESSION_COOKIE = "rajshaSession";

const getSessionToken = (req: Request) => {
    const cookie = req.headers.cookie
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${SESSION_COOKIE}=`));

    return cookie?.slice(SESSION_COOKIE.length + 1);
};

const setSessionCookie = (
    res: Response,
    token: string,
    maxAgeSeconds: number
) => {
    const secure = process.env.NODE_ENV === "production";
    res.setHeader(
        "Set-Cookie",
        `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${maxAgeSeconds}; SameSite=${secure ? "None" : "Lax"}${secure ? "; Secure" : ""}`
    );
};

const clearSessionCookie = (res: Response) => {
    const secure = process.env.NODE_ENV === "production";
    res.setHeader(
        "Set-Cookie",
        `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=${secure ? "None" : "Lax"}${secure ? "; Secure" : ""}`
    );
};

const handleAuthError = (res: Response, error: unknown) => {
    if (error instanceof UserAuthError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
            ...(error.resendAfterSeconds !== undefined
                ? { resendAfterSeconds: error.resendAfterSeconds }
                : {})
        });
    }

    if (error instanceof EmailConfigurationError) {
        return res.status(503).json({
            success: false,
            message: error.message
        });
    }

    if (error instanceof EmailDeliveryError) {
        return res.status(502).json({
            success: false,
            message: error.message
        });
    }

    console.error(
        "User authentication request failed:",
        error instanceof Error ? error.message : "Unknown error"
    );
    return res.status(500).json({
        success: false,
        message: "Unable to complete the authentication request."
    });
};

export const requestUserOtpController = async (req: Request, res: Response) => {
    try {
        const email = typeof req.body?.email === "string" ? req.body.email : "";
        const result = await requestUserOtp(email);
        return res.status(200).json({
            success: true,
            message: "A verification code has been sent to your email.",
            ...result
        });
    } catch (error) {
        return handleAuthError(res, error);
    }
};

export const verifyUserOtpController = async (req: Request, res: Response) => {
    try {
        const email = typeof req.body?.email === "string" ? req.body.email : "";
        const otp = typeof req.body?.otp === "string" ? req.body.otp : "";
        const result = await verifyUserOtp(email, otp);
        setSessionCookie(res, result.sessionToken, result.sessionMaxAgeSeconds);
        return res.status(200).json({
            success: true,
            message: "Email verified successfully.",
            data: { user: result.user }
        });
    } catch (error) {
        return handleAuthError(res, error);
    }
};

export const getUserSessionController = async (req: Request, res: Response) => {
    try {
        const user = await getUserSession(getSessionToken(req));
        if (!user) {
            clearSessionCookie(res);
            return res.status(401).json({
                success: false,
                message: "Please log in to continue."
            });
        }

        return res.status(200).json({
            success: true,
            data: { user }
        });
    } catch (error) {
        return handleAuthError(res, error);
    }
};

export const logoutUserController = async (req: Request, res: Response) => {
    try {
        await logoutUser(getSessionToken(req));
        clearSessionCookie(res);
        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        return handleAuthError(res, error);
    }
};

export const saveUserProfileController = async (req: Request, res: Response) => {
    try {
        const { name, mobile, address } = req.body ?? {};
        if (
            typeof name !== "string" ||
            typeof mobile !== "string" ||
            typeof address !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, phone number, and address must be strings."
            });
        }

        const user = await saveUserProfile(getSessionToken(req), {
            name,
            mobile,
            address
        });
        return res.status(200).json({
            success: true,
            message: "Profile saved successfully.",
            data: { user }
        });
    } catch (error) {
        return handleAuthError(res, error);
    }
};
