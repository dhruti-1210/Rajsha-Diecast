
import mongoose, { Schema, Document } from "mongoose";

export interface IReviewsMaster extends Document {
    user_id: mongoose.Types.ObjectId;
    message: string;
    name: string;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const ReviewsMasterSchema: Schema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "UserMaster"
        },
        message: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
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
            required: true
        },
        updatedBy: {
            type: String,
            required: true
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

const ReviewsMaster = mongoose.model<IReviewsMaster>(
    "ReviewsMaster",
    ReviewsMasterSchema
);

export default ReviewsMaster;
