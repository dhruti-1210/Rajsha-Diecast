import Cart, { ICart } from "../Models/Cart";

// Create Cart
export const CreateCart = async (
    data: Partial<ICart>
) => {
    try {
        const cart = await Cart.create(data);
        return cart;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Cart
export const GetAllCart = async () => {
    try {
        const cart = await Cart.find()
            .populate("Product_Id")
            .sort({ createdAt: -1 });

        return cart;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Cart By ID
export const GetCartById = async (id: string) => {
    try {
        const cart = await Cart.findById(id)
            .populate("Product_Id");

        return cart;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Cart
export const UpdateCart = async (
    id: string,
    data: Partial<ICart>
) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        ).populate("Product_Id");

        return cart;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Soft Delete Cart
export const DeleteCart = async (id: string) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            id,
            { isDeleted: true, updatedAt: new Date() },
            { new: true }
        );

        return cart;
    } catch (error: any) {
        throw new Error(error.message);
    }
};