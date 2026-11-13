
import OrderLineMaster, { IOrderLineMaster } from "../Models/OrderLineMaster";

// Create Order Line
export const CreateOrderLineMaster = async (data: Partial<IOrderLineMaster>) => {
    try {
        const orderLine = new OrderLineMaster(data);
        return await orderLine.save();
    } catch (error) {
        throw error;
    }
};

// Get All Order Lines
export const GetAllOrderLineMaster = async () => {
    try {
        return await OrderLineMaster.find({ isDeleted: false }).sort({ createdAt: -1 });
    } catch (error) {
        throw error;
    }
};

// Get Order Line By ID
export const GetOrderLineMasterById = async (id: string) => {
    try {
        return await OrderLineMaster.findOne({
            _id: id,
            isDeleted: false
        });
    } catch (error) {
        throw error;
    }
};

// Update Order Line
export const UpdateOrderLineMaster = async (
    id: string,
    data: Partial<IOrderLineMaster>
) => {
    try {
        return await OrderLineMaster.findOneAndUpdate(
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

// Soft Delete Order Line
export const DeleteOrderLineMaster = async (id: string, updatedBy: string) => {
    try {
        return await OrderLineMaster.findOneAndUpdate(
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
export const ChangeOrderLineActiveStatus = async (
    id: string,
    isActive: boolean,
    updatedBy: string
) => {
    try {
        return await OrderLineMaster.findOneAndUpdate(
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
export const ChangeOrderLineDisplayStatus = async (
    id: string,
    isDisplay: boolean,
    updatedBy: string
) => {
    try {
        return await OrderLineMaster.findOneAndUpdate(
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
