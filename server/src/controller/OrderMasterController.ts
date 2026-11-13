
import { Request, Response } from "express";
import {
    CreateOrderMaster,
    GetAllOrderMaster,
    GetOrderMasterById,
    UpdateOrderMaster,
    DeleteOrderMaster,
    ChangeOrderActiveStatus,
    ChangeOrderDisplayStatus
} from "../Services/OrderMasterServices";

// Create Order
export const CreateOrderMasterController = async (req: Request, res: Response) => {
    try {
        const order = await CreateOrderMaster(req.body);

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Orders
export const GetAllOrderMasterController = async (req: Request, res: Response) => {
    try {
        const orders = await GetAllOrderMaster();

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Order By ID
export const GetOrderMasterByIdController = async (req: Request, res: Response) => {
    try {
        const order = await GetOrderMasterById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Order
export const UpdateOrderMasterController = async (req: Request, res: Response) => {
    try {
        const order = await UpdateOrderMaster(req.params.id, req.body);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: order
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Soft Delete Order
export const DeleteOrderMasterController = async (req: Request, res: Response) => {
    try {
        const order = await DeleteOrderMaster(
            req.params.id,
            req.body.updatedBy
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            data: order
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangeOrderActiveStatusController = async (req: Request, res: Response) => {
    try {
        const order = await ChangeOrderActiveStatus(
            req.params.id,
            req.body.isActive,
            req.body.updatedBy
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order active status changed successfully",
            data: order
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Display Status
export const ChangeOrderDisplayStatusController = async (req: Request, res: Response) => {
    try {
        const order = await ChangeOrderDisplayStatus(
            req.params.id,
            req.body.isDisplay,
            req.body.updatedBy
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order display status changed successfully",
            data: order
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
