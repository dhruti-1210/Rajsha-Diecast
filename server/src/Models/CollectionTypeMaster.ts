
import mongoose, { Schema, Document } from "mongoose";

export interface ICollectionType extends Document {
    collectionName: string;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const CollectionTypeSchema: Schema = new Schema(
    {
        collectionName: {
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

const CollectionType = mongoose.model<ICollectionType>(
    "CollectionType",
    CollectionTypeSchema
);

export default CollectionType;
