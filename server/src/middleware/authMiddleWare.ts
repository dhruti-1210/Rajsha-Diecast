import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

interface JwtUser {
    id: string;
    username?: string;
    userName?: string;
    role?: string;
}

const SESSION_COOKIE = "rajshaSession";
const ADMIN_SESSION_COOKIE = "rajshaAdminSession";

declare global {
    namespace Express {
        interface Request {
            user?: JwtUser;
        }
    }
}

const getBearerToken = (authorization?: string) => {
    if (!authorization) {
        return null;
    }

    const [scheme, token, ...extra] = authorization.trim().split(/\s+/);
    if (scheme?.toLowerCase() !== "bearer" || !token || extra.length > 0) {
        return null;
    }

    return token;
};

const getSessionCookieToken = (
    cookieHeader?: string,
    cookieName = SESSION_COOKIE
) => {
    const cookie = cookieHeader
        ?.split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(`${cookieName}=`));

    return cookie?.slice(cookieName.length + 1) || null;
};

const getRequestToken = (req: Request) =>
    req.headers.authorization
        ? getBearerToken(req.headers.authorization)
        : getSessionCookieToken(req.headers.cookie);

const verifyJwtUser = (token: string, secret: string): JwtUser | null => {
    let decoded: string | JwtPayload;
    try {
        decoded = jwt.verify(token, secret);
    } catch {
        return null;
    }

    if (
        typeof decoded !== "object" ||
        decoded === null ||
        typeof decoded.id !== "string"
    ) {
        return null;
    }

    return {
        id: decoded.id,
        username: typeof decoded.username === "string"
            ? decoded.username
            : typeof decoded.userName === "string"
                ? decoded.userName
                : "",
        ...(typeof decoded.role === "string" ? { role: decoded.role } : {})
    };
};

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const token = getRequestToken(req);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: req.headers.authorization
                ? "Invalid authorization format"
                : "Authorization token is required"
        });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(500).json({
            success: false,
            message: "JWT secret is not configured"
        });
    }

    const user = verifyJwtUser(token, secret);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }

    req.user = user;
    return next();
};

export const adminSessionMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
        const clientOrigin = (
            process.env.CLIENT_URL || "http://localhost:3001"
        ).replace(/\/+$/, "");
        if (req.get("origin") !== clientOrigin) {
            return res.status(403).json({
                success: false,
                message: "Request origin is not allowed."
            });
        }
    }

    const token = getSessionCookieToken(req.headers.cookie, ADMIN_SESSION_COOKIE);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Admin authentication is required."
        });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return res.status(503).json({
            success: false,
            message: "Admin authentication is not configured."
        });
    }

    const user = verifyJwtUser(token, secret);
    if (!user || user.role !== "admin") {
        return res.status(401).json({
            success: false,
            message: "Admin session is invalid or expired."
        });
    }

    req.user = user;
    return next();
};

export const adminOnlyMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.user?.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access is required"
        });
    }
    return next();
};

export const optionalAuthMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    const token = getRequestToken(req);
    const secret = process.env.JWT_SECRET;
    if (!token || !secret) {
        return next();
    }

    const user = verifyJwtUser(token, secret);
    if (user) {
        req.user = user;
    }
    return next();
};
