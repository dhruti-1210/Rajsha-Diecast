import { Request, Response } from "express";
import { AdminAuthError, authenticateAdmin } from "../Services/AdminAuthServices";

const ADMIN_SESSION_COOKIE = "rajshaAdminSession";
const ADMIN_SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const setAdminSessionCookie = (res: Response, token: string) => {
    const secure = process.env.NODE_ENV === "production";
    res.setHeader(
        "Set-Cookie",
        `${ADMIN_SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=${ADMIN_SESSION_MAX_AGE_SECONDS}; SameSite=${secure ? "None" : "Lax"}${secure ? "; Secure" : ""}`
    );
};

const clearAdminSessionCookie = (res: Response) => {
    const secure = process.env.NODE_ENV === "production";
    res.setHeader(
        "Set-Cookie",
        `${ADMIN_SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=${secure ? "None" : "Lax"}${secure ? "; Secure" : ""}`
    );
};

export const loginAdminController = async (req: Request, res: Response) => {
    const email = req.body?.email;
    const password = req.body?.password;
    if (
        typeof email !== "string"
        || typeof password !== "string"
        || !email.trim()
        || !password
    ) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });
    }

    try {
        const result = await authenticateAdmin(email, password);
        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Email or password is incorrect."
            });
        }

        setAdminSessionCookie(res, result.token);
        res.setHeader("Cache-Control", "no-store");
        return res.status(200).json({
            success: true,
            message: "Admin login successful.",
            data: { admin: result.admin }
        });
    } catch (error) {
        if (error instanceof AdminAuthError) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        console.error(
            "Admin login failed:",
            error instanceof Error ? error.message : "Unknown error"
        );
        return res.status(500).json({
            success: false,
            message: "Unable to complete admin login."
        });
    }
};

export const getAdminSessionController = (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({
        success: true,
        data: {
            admin: {
                id: req.user?.id,
                email: req.user?.username
            }
        }
    });
};

export const logoutAdminController = (_req: Request, res: Response) => {
    clearAdminSessionCookie(res);
    return res.status(200).json({
        success: true,
        message: "Admin logged out."
    });
};
