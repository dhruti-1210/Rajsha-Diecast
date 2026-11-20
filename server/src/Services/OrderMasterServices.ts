
import { randomBytes } from "crypto";
import OrderMaster, { IOrderMaster } from "../Models/OrderMaster";
import OrderLineMaster from "../Models/OrderLineMaster";
import Checkout from "../Models/CheckoutModel";
import Cart from "../Models/Cart";
import ProductMaster from "../Models/ProductMaster";

export class OrderPlacementError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number = 400
    ) {
        super(message);
        this.name = "OrderPlacementError";
    }
}

// Create Order
export const CreateOrderMaster = async (data: Partial<IOrderMaster>) => {
    try {
        const order = new OrderMaster(data);
        return await order.save();
    } catch (error) {
        throw error;
    }
};

export const PlaceOrderForUser = async (userId: string) => {
    const cartItems = await Cart.find({
        User_Id: userId,
        isDeleted: { $ne: true }
    }).lean();

    if (cartItems.length === 0) {
        throw new OrderPlacementError("Your cart is empty.");
    }

    const productIds = [...new Set(cartItems.map((item) => item.Product_Id.toString()))];
    const products = await ProductMaster.find({
        _id: { $in: productIds },
        isActive: true,
        isDeleted: false
    }).lean();
    const productsById = new Map(products.map((product) => [product._id.toString(), product]));
    const quantitiesByProduct = new Map<string, number>();

    for (const item of cartItems) {
        const productId = item.Product_Id.toString();
        const product = productsById.get(productId);
        if (!product) {
            throw new OrderPlacementError("A product in your cart is no longer available.", 409);
        }
        if (!Number.isSafeInteger(item.Quantity) || item.Quantity < 1) {
            throw new OrderPlacementError("A cart item has an invalid quantity.", 409);
        }

        const quantity = (quantitiesByProduct.get(productId) ?? 0) + item.Quantity;
        if (quantity > product.TotalStock) {
            throw new OrderPlacementError(
                `Only ${product.TotalStock} of ${product.Name} are currently available.`,
                409
            );
        }
        quantitiesByProduct.set(productId, quantity);
    }

    const orderItems = [...quantitiesByProduct.entries()].map(([productId, Quantity]) => {
        const product = productsById.get(productId);
        if (!product) {
            throw new OrderPlacementError("A product in your cart is no longer available.", 409);
        }
        return {
            product_ID: product._id,
            Price: product.Price,
            Quantity,
            lineTotal: product.Price * Quantity
        };
    });
    const total = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
    if (!Number.isFinite(total)) {
        throw new OrderPlacementError("The order total is invalid.", 409);
    }

    const order = await OrderMaster.create({
        user_id: userId,
        Total: total,
        PaymentStatus: "Pending",
        TrackingId: `RD-${randomBytes(8).toString("hex").toUpperCase()}`,
        createdBy: userId,
        updatedBy: userId
    });

    try {
        const orderLines = await OrderLineMaster.insertMany(orderItems.map((item) => ({
            order_Master_id: order._id,
            product_ID: item.product_ID,
            Price: item.Price,
            Quantity: item.Quantity,
            createdBy: userId,
            updatedBy: userId
        })));
        const checkout = await Checkout.create({
            order_Master_id: order._id,
            isPLACED: true,
            createdBy: userId,
            updatedBy: userId
        });

        await Cart.updateMany(
            { _id: { $in: cartItems.map((item) => item._id) }, User_Id: userId },
            { isDeleted: true }
        );

        return {
            ...order.toObject(),
            items: orderLines.map((line) => ({
                ...line.toObject(),
                product_ID: productsById.get(line.product_ID.toString()) ?? line.product_ID
            })),
            checkout: checkout.toObject()
        };
    } catch (error) {
        try {
            await Promise.all([
                Checkout.deleteMany({ order_Master_id: order._id }),
                OrderLineMaster.deleteMany({ order_Master_id: order._id }),
                OrderMaster.deleteOne({ _id: order._id })
            ]);
        } catch (rollbackError) {
            const originalMessage = error instanceof Error ? error.message : "Unknown order error.";
            const rollbackMessage = rollbackError instanceof Error
                ? rollbackError.message
                : "Unknown rollback error.";
            throw new Error(
                `Order placement failed (${originalMessage}) and cleanup failed (${rollbackMessage}).`
            );
        }
        throw error;
    }
};

// Get All Orders
export const GetAllOrderMaster = async () => {
    try {
        return await OrderMaster.find({ isDeleted: false }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

export const GetOrderHistoryByUserId = async (userId: string) => {
    const orders = await OrderMaster.find({
        user_id: userId,
        isDeleted: false
    }).sort({ createdAt: -1 });

    if (orders.length === 0) {
        return [];
    }

    const orderIds = orders.map((order) => order._id);
    const [orderLines, checkouts] = await Promise.all([
        OrderLineMaster.find({
            order_Master_id: { $in: orderIds },
            isDeleted: false
        }).populate("product_ID", "Name BrandName ModelCode Size Image").lean(),
        Checkout.find({ order_Master_id: { $in: orderIds } })
            .select("order_Master_id isPLACED isPROCESSING isSHIPPED isTransist isDELIVERED")
            .sort({ updatedAt: -1 })
            .lean()
    ]);

    const orderLinesByOrderId = new Map<string, typeof orderLines>();
    for (const orderLine of orderLines) {
        const orderId = orderLine.order_Master_id.toString();
        const currentLines = orderLinesByOrderId.get(orderId) ?? [];
        currentLines.push(orderLine);
        orderLinesByOrderId.set(orderId, currentLines);
    }

    const checkoutByOrderId = new Map<string, (typeof checkouts)[number]>();
    for (const checkout of checkouts) {
        const orderId = checkout.order_Master_id.toString();
        if (!checkoutByOrderId.has(orderId)) {
            checkoutByOrderId.set(orderId, checkout);
        }
    }

    return orders.map((order) => {
        const orderId = order._id.toString();
        return {
            ...order.toObject(),
            items: orderLinesByOrderId.get(orderId) ?? [],
            checkout: checkoutByOrderId.get(orderId) ?? null
        };
    });
};

// Get Order By ID
export const GetOrderMasterById = async (id: string) => {
    try {
        return await OrderMaster.findOne({
            _id: id,
            isDeleted: false
        });
    } catch (error) {
        throw error;
    }
};

// Update Order
export const UpdateOrderMaster = async (
    id: string,
    data: Partial<IOrderMaster>
) => {
    try {
        return await OrderMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                ...data,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );
    } catch (error) {
        throw error;
    }
};

// Soft Delete Order
export const DeleteOrderMaster = async (id: string, updatedBy: string) => {
    try {
        return await OrderMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDeleted: true,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

// Change Active Status
export const ChangeOrderActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await OrderMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isActive,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

// Change Display Status
export const ChangeOrderDisplayStatus = async (
    id: string,
    isDisplay: boolean,
    updatedBy: string
) => {
    try {
        return await OrderMaster.findOneAndUpdate(
            { _id: id, isDeleted: false },
            {
                isDisplay,
                updatedBy,
                updatedAt: new Date()
            },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};
