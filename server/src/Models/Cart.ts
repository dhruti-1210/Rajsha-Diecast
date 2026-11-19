import mongoose, { Schema, Document } from "mongoose";

export interface ICart extends Document {
    User_Id: mongoose.Types.ObjectId;
    Product_Id: mongoose.Types.ObjectId;
    Quantity: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema: Schema = new Schema(
    {
        User_Id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "UserMaster"
        },
        Product_Id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "ProductMaster"
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
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Cart = mongoose.model<ICart>(
    "Cart",
    CartSchema
);

export default Cart;