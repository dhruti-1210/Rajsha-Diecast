import mongoose, { Schema, Document } from 'mongoose';

export interface IBrand extends Document {
    brandName: string;
    modelCount: number;
    scaleSize: number;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    createdBy: string;
    isActive: boolean;
    isDeleted: boolean;
}

const BrandSchema: Schema = new Schema(
    {
        brandName: { type: String, required: true, trim: true },
        modelCount: { type: Number, required: true, min: 0 },
        scaleSize: { type: Number, required: true, min: 0 },
        createdBy: { type: String, required: true, trim: true },
        updatedBy: { type: String, required: true, trim: true },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

BrandSchema.index({ isDeleted: 1, isActive: 1, createdAt: -1 });
BrandSchema.index({ brandName: 1 });

const Brand = mongoose.model<IBrand>('Brand', BrandSchema);
export default Brand;
