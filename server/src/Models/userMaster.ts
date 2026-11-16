
import mongoose, { Schema, Document } from "mongoose";

export interface IUserMaster extends Document {
    name: string;
    mobile: string;
    email: string;
    address: string;
    emailVerified: boolean;
    otpHash?: string;
    otpExpiresAt?: Date;
    otpResendAvailableAt?: Date;
    otpAttempts: number;
    authSessionTokenHash?: string;
    authSessionExpiresAt?: Date;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const UserMasterSchema: Schema = new Schema(
    {
        name: {
            type: String,
            default: "",
            trim: true
        },
        mobile: {
            type: String,
            default: "",
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        address: {
            type: String,
            default: ""
        },
        emailVerified: {
            type: Boolean,
            default: false
        },
        otpHash: {
            type: String,
            select: false
        },
        otpExpiresAt: {
            type: Date,
            select: false
        },
        otpResendAvailableAt: {
            type: Date,
            select: false
        },
        otpAttempts: {
            type: Number,
            default: 0,
            select: false
        },
        authSessionTokenHash: {
            type: String,
            select: false
        },
        authSessionExpiresAt: {
            type: Date,
            select: false
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: String,
            required: true,
            default: "system"
        },
        updatedBy: {
            type: String,
            required: true,
            default: "system"
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDisplay: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
);

const UserMaster = mongoose.model<IUserMaster>(
    "UserMaster",
    UserMasterSchema
);

export default UserMaster;
