
import OrderMaster, { IOrderMaster } from "../Models/OrderMaster";
import OrderLineMaster from "../Models/OrderLineMaster";
import Checkout from "../Models/CheckoutModel";

// Create Order
export const CreateOrderMaster = async (data: Partial<IOrderMaster>) => {
    try {
        const order = new OrderMaster(data);
        return await order.save();
    } catch (error) {
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
