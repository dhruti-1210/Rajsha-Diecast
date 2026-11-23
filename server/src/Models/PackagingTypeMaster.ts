import mongoose, { Schema, Document } from "mongoose";

export interface IPackagingType extends Document {
    packagingName?: string;
    packaginName?: string;
    Description?: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    isActive: boolean;
    isDeleted: boolean;
}

const packagingTypeSchema = new Schema<IPackagingType>(
    {
        packagingName: { type: String, trim: true },
        packaginName: { type: String, trim: true },
        Description: { type: String, trim: true, default: "" },
        createdBy: { type: String, trim: true },
        updatedBy: { type: String, trim: true },
        isActive: { type: Boolean, default: true },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

packagingTypeSchema.index({ isDeleted: 1, isActive: 1, createdAt: -1 });
packagingTypeSchema.index({ packagingName: 1 });
packagingTypeSchema.index({ packaginName: 1 });

const PackagingType = mongoose.model<IPackagingType>("PackagingType", packagingTypeSchema);
export default PackagingType;
