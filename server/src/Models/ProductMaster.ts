
import mongoose, { Schema, Document } from "mongoose";

export interface IProductMaster extends Document {
    Name: string;
    BrandName?: string;
    Company_Id?: mongoose.Types.ObjectId;
    TotalStock: number;
    Price: number;
    ModelCode: string;
    Size: string;
    Description: string;
    Packagingtype_Id: mongoose.Types.ObjectId;
    Image: string[];
    CollectionName?: string;
    Collectiontype_id?: mongoose.Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

export type ProductMasterInput = Partial<IProductMaster>;

const ProductMasterSchema: Schema = new Schema(
    {
        Name: {
            type: String,
            required: true,
            trim: true
        },
        BrandName: {
            type: String,
            trim: true,
            default: ""
        },
        Company_Id: {
            type: Schema.Types.ObjectId,
            required: false
        },
        TotalStock: {
            type: Number,
            default: 0
        },
        Price: {
            type: Number,
            required: true
        },
        ModelCode: {
            type: String,
            required: true,
            trim: true
        },
        Size: {
            type: String,
            default: ""
        },
        Description: {
            type: String,
            default: ""
        },
        Packagingtype_Id: {
            type: Schema.Types.ObjectId,
            required: true
        },
        Image: {
            type: [String],
            default: []
        },
        CollectionName: {
            type: String,
            trim: true,
            default: ""
        },
        Collectiontype_id: {
            type: Schema.Types.ObjectId,
            required: false
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

const ProductMaster = mongoose.model<IProductMaster>(
    "ProductMaster",
    ProductMasterSchema
);

export default ProductMaster;
