import mongoose, { Schema, Document } from "mongoose";

export interface IScaleSize extends Document {
    ScaleSize: string;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDeleted: boolean;
}

const ScaleSizeSchema: Schema = new Schema(
    {
        ScaleSize: {
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
        isDeleted: {
            type: Boolean,
            default: false
        }
    }
);

const ScaleSize = mongoose.model<IScaleSize>(
    "ScaleSize",
    ScaleSizeSchema
);

export default ScaleSize;