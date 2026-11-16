import mongoose, { Schema, Document } from "mongoose";

export interface ICart extends Document {
    Product_Id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema: Schema = new Schema(
    {
        Product_Id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "ProductMaster"
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