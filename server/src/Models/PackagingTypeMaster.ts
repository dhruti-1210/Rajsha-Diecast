import mongoose, { Schema, Document } from 'mongoose';

export interface IPackagingType extends Document {
    packagingName: string;
    Description: string;

    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    createdBy: string;
    isActive: boolean;
    isDeleted: boolean;
}   

const PackagingTypeSchema: Schema = new Schema(
    {
        packagingName: {
            type: String,
            required: true
        },
        Description: {
            type: String,
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

const PackagingType = mongoose.model<IPackagingType>('PackagingType', PackagingTypeSchema);

export default PackagingType;
