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
        createdBy: {
            type: String,
            required: true,
            trim: true
        },
        updatedBy: {
            type: String,
            required: true,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

ScaleSizeSchema.index({ isDeleted: 1, isActive: 1, createdAt: -1 });
ScaleSizeSchema.index({ ScaleSize: 1 });

const ScaleSize = mongoose.model<IScaleSize>("ScaleSize", ScaleSizeSchema);
export default ScaleSize;
