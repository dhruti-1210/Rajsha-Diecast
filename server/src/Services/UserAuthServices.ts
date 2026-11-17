import {
    createHash,
    createHmac,
    randomInt,
    timingSafeEqual
} from "crypto";
import jwt, { type SignOptions } from "jsonwebtoken";
import mongoose from "mongoose";
import UserMaster from "../Models/userMaster";
import { sendOtpEmail } from "./EmailService";

const OTP_LIFETIME_MS = 10 * 60 * 1000;
const OTP_RESEND_DELAY_MS = 2 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

export class UserAuthError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly resendAfterSeconds?: number
    ) {
        super(message);
    }
}

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const getOtpSecret = () => {
    const secret = process.env.OTP_SECRET;
    if (!secret || secret.length < 32) {
        throw new UserAuthError(
            "Email verification is not configured on the server.",
            503
        );
    }
    return secret;
};

const hashOtp = (email: string, otp: string) =>
    createHmac("sha256", getOtpSecret())
        .update(`${email}:${otp}`)
        .digest("hex");

const hashSessionToken = (token: string) =>
    createHash("sha256").update(token).digest("hex");

const clearOtp = async (
    userId: mongoose.Types.ObjectId,
    otpHash?: string,
    clearResendDelay = false
) => {
    await UserMaster.updateOne(
        { _id: userId, ...(otpHash ? { otpHash } : {}) },
        {
            $unset: {
                otpHash: 1,
                otpExpiresAt: 1,
                ...(clearResendDelay ? { otpResendAvailableAt: 1 } : {}),
                otpAttempts: 1
            }
        }
    );
};

const resendDelay = (availableAt: Date) =>
    Math.max(1, Math.ceil((availableAt.getTime() - Date.now()) / 1000));

const createUserSessionToken = (userId: string, email: string) => {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN?.trim();
    if (!secret || !expiresIn) {
        throw new UserAuthError(
            "JWT authentication is not configured on the server.",
            503
        );
    }

    let sessionToken: string;
    try {
        sessionToken = jwt.sign(
            { id: userId, username: email, role: "user" },
            secret,
            { expiresIn: expiresIn as SignOptions["expiresIn"] }
        );
    } catch {
        throw new UserAuthError(
            "JWT authentication is not configured correctly.",
            503
        );
    }

    const decoded = jwt.decode(sessionToken);
    if (!decoded || typeof decoded === "string" || typeof decoded.exp !== "number") {
        throw new UserAuthError(
            "JWT expiration is not configured correctly.",
            503
        );
    }

    const expiresAt = new Date(decoded.exp * 1000);
    if (expiresAt <= new Date()) {
        throw new UserAuthError(
            "JWT expiration must be set in the future.",
            503
        );
    }

    return {
        sessionToken,
        expiresAt
    };
};

export const requestUserOtp = async (email: string) => {
    const normalizedEmail = normalizeEmail(email);
    if (
        normalizedEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
        throw new UserAuthError("Enter a valid email address.", 400);
    }

    getOtpSecret();

    let user = await UserMaster.findOne({ email: normalizedEmail })
        .select("+otpResendAvailableAt");

    if (user?.isDeleted || (user && !user.isActive)) {
        throw new UserAuthError(
            "This account cannot receive a verification code.",
            400
        );
    }

    if (!user) {
        user = await new UserMaster({ email: normalizedEmail }).save();
    }

    const now = new Date();
    if (user.otpResendAvailableAt && user.otpResendAvailableAt > now) {
        throw new UserAuthError(
            "Please wait before requesting another verification code.",
            429,
            resendDelay(user.otpResendAvailableAt)
        );
    }

    const otp = randomInt(0, 1_000_000).toString().padStart(6, "0");
    const otpHash = hashOtp(normalizedEmail, otp);
    const resendAvailableAt = new Date(now.getTime() + OTP_RESEND_DELAY_MS);
    const updatedUser = await UserMaster.findOneAndUpdate(
        {
            _id: user._id,
            isDeleted: false,
            isActive: true,
            $or: [
                { otpResendAvailableAt: { $exists: false } },
                { otpResendAvailableAt: { $lte: now } }
            ]
        },
        {
            $set: {
                otpHash,
                otpExpiresAt: new Date(now.getTime() + OTP_LIFETIME_MS),
                otpResendAvailableAt: resendAvailableAt,
                otpAttempts: 0
            }
        },
        { new: true }
    );

    if (!updatedUser) {
        const latestUser = await UserMaster.findById(user._id)
            .select("+otpResendAvailableAt");
        if (latestUser?.otpResendAvailableAt) {
            throw new UserAuthError(
                "Please wait before requesting another verification code.",
                429,
                resendDelay(latestUser.otpResendAvailableAt)
            );
        }
        throw new UserAuthError("Unable to request a verification code.", 409);
    }

    try {
        await sendOtpEmail(normalizedEmail, otp);
    } catch (error) {
        await clearOtp(user._id, otpHash, true);
        throw error;
    }

    return { resendAfterSeconds: OTP_RESEND_DELAY_MS / 1000 };
};

export const verifyUserOtp = async (email: string, otp: string) => {
    const normalizedEmail = normalizeEmail(email);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || !/^\d{6}$/.test(otp)) {
        throw new UserAuthError("Enter a valid email and 6-digit code.", 400);
    }

    const user = await UserMaster.findOne({
        email: normalizedEmail,
        isDeleted: false,
        isActive: true
    }).select("+otpHash +otpExpiresAt +otpAttempts");

    if (!user?.otpHash || !user.otpExpiresAt || user.otpExpiresAt <= new Date()) {
        if (user?.otpHash) {
            await clearOtp(user._id, user.otpHash);
        }
        throw new UserAuthError(
            "The verification code is invalid or has expired. Request a new code.",
            400
        );
    }

    const storedHash = Uint8Array.from(Buffer.from(user.otpHash, "hex"));
    const submittedHash = Uint8Array.from(
        Buffer.from(hashOtp(normalizedEmail, otp), "hex")
    );
    const matches =
        storedHash.length === submittedHash.length &&
        timingSafeEqual(storedHash, submittedHash);

    if (!matches) {
        const updatedUser = await UserMaster.findOneAndUpdate(
            {
                _id: user._id,
                otpHash: user.otpHash,
                otpExpiresAt: { $gt: new Date() },
                otpAttempts: { $lt: OTP_MAX_ATTEMPTS }
            },
            { $inc: { otpAttempts: 1 } },
            { new: true }
        ).select("+otpAttempts +otpResendAvailableAt");

        if (!updatedUser || updatedUser.otpAttempts >= OTP_MAX_ATTEMPTS) {
            await clearOtp(user._id, user.otpHash);
            throw new UserAuthError(
                "Too many incorrect codes. Request a new verification code.",
                429,
                updatedUser?.otpResendAvailableAt
                    ? resendDelay(updatedUser.otpResendAvailableAt)
                    : undefined
            );
        }

        throw new UserAuthError("The verification code is incorrect.", 400);
    }

    const { sessionToken, expiresAt } = createUserSessionToken(
        user._id.toString(),
        normalizedEmail
    );
    const now = new Date();
    const authenticatedUser = await UserMaster.findOneAndUpdate(
        {
            _id: user._id,
            otpHash: user.otpHash,
            otpExpiresAt: { $gt: now },
            otpAttempts: { $lt: OTP_MAX_ATTEMPTS },
            isDeleted: false,
            isActive: true
        },
        {
            $set: {
                emailVerified: true,
                authSessionTokenHash: hashSessionToken(sessionToken),
                authSessionExpiresAt: expiresAt
            },
            $unset: {
                otpHash: 1,
                otpExpiresAt: 1,
                otpResendAvailableAt: 1,
                otpAttempts: 1
            }
        },
        { new: true }
    ).select("email name mobile address");

    if (!authenticatedUser) {
        throw new UserAuthError(
            "The verification code is invalid or has expired. Request a new code.",
            400
        );
    }

    return {
        sessionToken,
        sessionMaxAgeSeconds: Math.max(
            1,
            Math.floor((expiresAt.getTime() - Date.now()) / 1000)
        ),
        user: {
            email: authenticatedUser.email,
            name: authenticatedUser.name,
            mobile: authenticatedUser.mobile,
            address: authenticatedUser.address,
            profileComplete: Boolean(
                authenticatedUser.name.trim() && authenticatedUser.mobile.trim()
            )
        }
    };
};

export const getUserSession = async (sessionToken?: string) => {
    if (!sessionToken) {
        return null;
    }

    const user = await UserMaster.findOne({
        authSessionTokenHash: hashSessionToken(sessionToken),
        authSessionExpiresAt: { $gt: new Date() },
        isDeleted: false,
        isActive: true,
        emailVerified: true
    }).select("email name mobile address");

    if (!user) {
        return null;
    }

    return {
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        address: user.address,
        profileComplete: Boolean(user.name.trim() && user.mobile.trim())
    };
};

export const logoutUser = async (sessionToken?: string) => {
    if (!sessionToken) {
        return;
    }

    await UserMaster.updateOne(
        { authSessionTokenHash: hashSessionToken(sessionToken) },
        {
            $unset: {
                authSessionTokenHash: 1,
                authSessionExpiresAt: 1
            }
        }
    );
};

export const saveUserProfile = async (
    sessionToken: string | undefined,
    profile: { name: string; mobile: string; address: string }
) => {
    if (!sessionToken) {
        throw new UserAuthError("Your session has expired. Please log in again.", 401);
    }

    const name = profile.name.trim();
    const mobile = profile.mobile.trim();
    const address = profile.address.trim();
    if (name.length < 2 || name.length > 100) {
        throw new UserAuthError("Enter a name between 2 and 100 characters.", 400);
    }
    if (!mobile || mobile.length > 30) {
        throw new UserAuthError("Enter a valid phone number.", 400);
    }
    if (address.length > 250) {
        throw new UserAuthError("Address must be 250 characters or less.", 400);
    }

    const user = await UserMaster.findOneAndUpdate(
        {
            authSessionTokenHash: hashSessionToken(sessionToken),
            authSessionExpiresAt: { $gt: new Date() },
            isDeleted: false,
            isActive: true,
            emailVerified: true
        },
        {
            $set: {
                name,
                mobile,
                address,
                updatedBy: "user",
                updatedAt: new Date()
            }
        },
        { new: true, runValidators: true }
    ).select("email name mobile address");

    if (!user) {
        throw new UserAuthError("Your session has expired. Please log in again.", 401);
    }

    return {
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        address: user.address,
        profileComplete: true
    };
};
