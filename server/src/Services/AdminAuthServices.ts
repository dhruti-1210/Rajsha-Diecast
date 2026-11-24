import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminUserMaster from "../Models/AdminUserMaster";

export class AdminAuthError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number
    ) {
        super(message);
    }
}

export const authenticateAdmin = async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const admin = await AdminUserMaster.findOne({
        email: normalizedEmail,
        isDeleted: false
    }).select("+password");

    if (!admin || !(await compare(password, admin.password))) {
        return null;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new AdminAuthError("Admin authentication is not configured.", 503);
    }

    try {
        const token = jwt.sign(
            {
                id: admin._id.toString(),
                username: admin.email,
                role: "admin"
            },
            secret,
            { expiresIn: "7d" }
        );
        return {
            token,
            admin: {
                id: admin._id.toString(),
                email: admin.email
            }
        };
    } catch {
        throw new AdminAuthError("Admin authentication could not be started.", 503);
    }
};
