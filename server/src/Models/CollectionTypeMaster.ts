import mongoose, { Schema, Document } from "mongoose";

export interface ICollectionType extends Document {
    collectionName: string;
    collectionDescription: string;
    image: string;
    sortOrder: number;
    displayOnHomepage: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdBy?: string;
    updatedBy?: string;
    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const CollectionTypeSchema = new Schema<ICollectionType>(
    {
        collectionName: { type: String, required: true, trim: true },
        collectionDescription: { type: String, default: "", trim: true },
        image: { type: String, default: "", trim: true },
        sortOrder: { type: Number, default: 0 },
        displayOnHomepage: { type: Boolean, default: false },
        createdBy: { type: String, trim: true },
        updatedBy: { type: String, trim: true },
        isActive: { type: Boolean, default: true },
        isDisplay: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false }
    },
    { timestamps: true }
);

CollectionTypeSchema.index({ isDeleted: 1, isActive: 1, isDisplay: 1, sortOrder: 1, createdAt: -1 });
CollectionTypeSchema.index({ collectionName: 1 });

const CollectionType = mongoose.model<ICollectionType>("CollectionType", CollectionTypeSchema);
export default CollectionType;
