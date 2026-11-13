
import OrderMaster, { IOrderMaster } from "../Models/OrderMaster";

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
