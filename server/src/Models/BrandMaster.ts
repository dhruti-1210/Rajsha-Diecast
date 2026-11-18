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
        brandName: {
            type: String,
            required: true
        },
        modelCount: {
            type: Number,
            required: true
        },
        scaleSize: {
            type: Number,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: String,
            required: true
        },
        createdBy: {
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
)


const Brand = mongoose.model<IBrand>('Brand', BrandSchema);

export default Brand;
