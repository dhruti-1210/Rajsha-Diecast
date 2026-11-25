
import mongoose, { Schema, Document } from "mongoose";

export interface IOrderMaster extends Document {
    user_id: mongoose.Types.ObjectId;
    SubTotal: number;
    ShippingCharge: number;
    Total: number;
    PaymentStatus: string;
    RazorpayPaymentId?: string;
    TrackingId: string;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;

    isActive: boolean;
    isDisplay: boolean;
    isDeleted: boolean;
}

const OrderMasterSchema: Schema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "UserMaster"
        },
        SubTotal: {
            type: Number,
            required: true,
            default: 0
        },
        ShippingCharge: {
            type: Number,
            required: true,
            default: 0
        },
        Total: {
            type: Number,
            required: true,
            default: 0
        },
        PaymentStatus: {
            type: String,
            required: true,
            default: "Pending"
        },
        RazorpayPaymentId: {
            type: String,
            unique: true,
            sparse: true
        },
        TrackingId: {
            type: String,
            default: ""
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

const OrderMaster = mongoose.model<IOrderMaster>(
    "OrderMaster",
    OrderMasterSchema
);

export default OrderMaster;
