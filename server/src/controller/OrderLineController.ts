
import { Request, Response } from "express";
import {
    CreateOrderLineMaster,
    GetAllOrderLineMaster,
    GetOrderLineMasterById,
    UpdateOrderLineMaster,
    DeleteOrderLineMaster,
    ChangeOrderLineActiveStatus,
    ChangeOrderLineDisplayStatus
} from "../Services/OrderLineServices";

// Create Order Line
export const CreateOrderLineMasterController = async (req: Request, res: Response) => {
    try {
        const orderLine = await CreateOrderLineMaster(req.body);

        return res.status(201).json({
            success: true,
            message: "Order line created successfully",
            data: orderLine
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Order Lines
export const GetAllOrderLineMasterController = async (req: Request, res: Response) => {
    try {
        const orderLines = await GetAllOrderLineMaster();

        return res.status(200).json({
            success: true,
            message: "Order lines fetched successfully",
            data: orderLines
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Order Line By ID
export const GetOrderLineMasterByIdController = async (req: Request, res: Response) => {
    try {
        const orderLine = await GetOrderLineMasterById(req.params.id);

        if (!orderLine) {
            return res.status(404).json({
                success: false,
                message: "Order line not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order line fetched successfully",
            data: orderLine
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Order Line
export const UpdateOrderLineMasterController = async (req: Request, res: Response) => {
    try {
        const orderLine = await UpdateOrderLineMaster(req.params.id, req.body);

        if (!orderLine) {
            return res.status(404).json({
                success: false,
                message: "Order line not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order line updated successfully",
            data: orderLine
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Soft Delete Order Line
export const DeleteOrderLineMasterController = async (req: Request, res: Response) => {
    try {
        const orderLine = await DeleteOrderLineMaster(
            req.params.id,
            req.body.updatedBy
        );

        if (!orderLine) {
            return res.status(404).json({
                success: false,
                message: "Order line not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order line deleted successfully",
            data: orderLine
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangeOrderLineActiveStatusController = async (req: Request, res: Response) => {
    try {
        const orderLine = await ChangeOrderLineActiveStatus(
            req.params.id,
            req.body.isActive,
            req.body.updatedBy
        );

        if (!orderLine) {
            return res.status(404).json({
                success: false,
                message: "Order line not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order line active status changed successfully",
            data: orderLine
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Display Status
export const ChangeOrderLineDisplayStatusController = async (req: Request, res: Response) => {
    try {
        const orderLine = await ChangeOrderLineDisplayStatus(
            req.params.id,
            req.body.isDisplay,
            req.body.updatedBy
        );

        if (!orderLine) {
            return res.status(404).json({
                success: false,
                message: "Order line not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order line display status changed successfully",
            data: orderLine
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
