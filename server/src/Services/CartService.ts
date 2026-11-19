import Cart, { ICart } from "../Models/Cart";

const mergeDuplicateCartItems = async (items: ICart[]) => {
    const groups = new Map<string, ICart[]>();
    for (const item of items) {
        const productId = item.Product_Id.toString();
        const group = groups.get(productId) ?? [];
        group.push(item);
        groups.set(productId, group);
    }

    for (const group of groups.values()) {
        if (group.length < 2) continue;
        const [primary, ...duplicates] = group;
        const quantity = group.reduce((sum, item) => sum + (item.Quantity || 1), 0);
        await Cart.updateOne({ _id: primary._id }, { Quantity: quantity });
        await Cart.updateMany(
            { _id: { $in: duplicates.map((item) => item._id) } },
            { isDeleted: true }
        );
    }
};

// Create Cart
export const CreateCart = async (
    data: Pick<ICart, "Product_Id">,
    userId: string,
    quantity: number
) => {
    try {
        const filter = {
            User_Id: userId,
            Product_Id: data.Product_Id,
            isDeleted: { $ne: true }
        };
        const items = await Cart.find(filter).sort({ createdAt: 1 });
        await mergeDuplicateCartItems(items);

        const existing = items[0];
        const cart = existing
            ? await Cart.findOneAndUpdate(
                { _id: existing._id },
                { $inc: { Quantity: quantity } },
                { new: true, runValidators: true }
            ).populate("Product_Id")
            : await Cart.create({ ...data, User_Id: userId, Quantity: quantity });
        return cart;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get All Cart
export const GetAllCart = async (userId: string) => {
    try {
        const filter = {
            User_Id: userId,
            isDeleted: { $ne: true }
        };
        const items = await Cart.find(filter).sort({ createdAt: 1 });
        await mergeDuplicateCartItems(items);

        const cart = await Cart.find(filter)
            .populate("Product_Id")
            .sort({ createdAt: -1 });

        return cart;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Get Cart By ID
export const GetCartById = async (id: string, userId: string) => {
    try {
        const cart = await Cart.findOne({
            _id: id,
            User_Id: userId,
            isDeleted: { $ne: true }
        })
            .populate("Product_Id");

        return cart;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Update Cart
export const UpdateCart = async (
    id: string,
    userId: string,
    data: Pick<ICart, "Quantity">
) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { _id: id, User_Id: userId, isDeleted: { $ne: true } },
            { Quantity: data.Quantity },
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
export const DeleteCart = async (id: string, userId: string) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { _id: id, User_Id: userId, isDeleted: { $ne: true } },
            { isDeleted: true },
            { new: true }
        );

        return cart;
    } catch (error: any) {
        throw new Error(error.message);
    }
};