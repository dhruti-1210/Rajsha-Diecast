import mongoose, { Schema, Document } from "mongoose";

export interface ICheckout extends Document {
    order_Master_id: mongoose.Types.ObjectId;

    isPLACED: boolean;
    isPROCESSING: boolean;
    isSHIPPED: boolean;
    isTransist: boolean;
    isDELIVERED: boolean;

    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
}

const CheckoutSchema: Schema = new Schema(
    {
        order_Master_id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "OrderMaster"
        },
        isPLACED: {
            type: Boolean,
            default: false
        },
        isPROCESSING: {
            type: Boolean,
            default: false
        },
        isSHIPPED: {
            type: Boolean,
            default: false
        },
        isTransist: {
            type: Boolean,
            default: false
        },
        isDELIVERED: {
            type: Boolean,
            default: false
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
        }
    }
);

const Checkout = mongoose.model<ICheckout>(
    "Checkout",
    CheckoutSchema
);

export default Checkout;