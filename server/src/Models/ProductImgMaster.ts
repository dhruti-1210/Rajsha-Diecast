import mongoose, { Schema, Document } from "mongoose";

export interface IProductImgMaster extends Document {
    productId: mongoose.Types.ObjectId;
    imgUrl: string;


    isActive: boolean;
    createdAt: Date;
    createdBy: string;
    updatedAt: Date;
    updatedBy: string;

    deletedAt: Date;
    deletedBy: string;
}

const ProductImgMasterSchema: Schema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "ProductMaster"
        },
        imgUrl: {
            type: String,
            required: true,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        createdBy: {
            type: String,
            required: true
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        updatedBy: {
            type: String,
            required: true
        },
        deletedAt: {
            type: Date
        },
        deletedBy: {
            type: String
        }
    }
);

const ProductImgMaster = mongoose.model<IProductImgMaster>(
    "ProductImgMaster",
    ProductImgMasterSchema
);

export default ProductImgMaster;