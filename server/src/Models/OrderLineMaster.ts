
import mongoose, { Schema, Document } from "mongoose";

export interface IOrderLineMaster extends Document {
    order_Master_id: mongoose.Types.ObjectId;
    product_ID: mongoose.Types.ObjectId;
    Price: number;
    Quantity: number;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const OrderLineMasterSchema: Schema = new Schema(
    {
        order_Master_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "OrderMaster"
        },
        product_ID: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "ProductMaster"
        },
        Price: {
            type: Number,
            required: true,
            default: 0
        },
        Quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "Quantity must be a whole number."
            }
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

const OrderLineMaster = mongoose.model<IOrderLineMaster>(
    "OrderLineMaster",
    OrderLineMasterSchema
);

export default OrderLineMaster;
