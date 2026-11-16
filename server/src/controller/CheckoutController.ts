import { Request, Response } from "express";

import {
    CreateCheckout,
    GetAllCheckout,
    GetCheckoutById,
    UpdateCheckoutStatus,
    DeleteCheckout
} from "../Services/CheckoutServices";

// Create Checkout
export const CreateCheckoutController = async (
    req: Request,
    res: Response
) => {
    try {
        const checkout = await CreateCheckout(req.body);

        return res.status(201).json({
            success: true,
            message: "Checkout created successfully",
            data: checkout
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Checkout
export const GetAllCheckoutController = async (
    req: Request,
    res: Response
) => {
    try {
        const checkout = await GetAllCheckout();

        return res.status(200).json({
            success: true,
            message: "Checkout fetched successfully",
            data: checkout
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Checkout By ID
export const GetCheckoutByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const checkout = await GetCheckoutById(req.params.id);

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: "Checkout not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Checkout fetched successfully",
            data: checkout
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Checkout Status
export const UpdateCheckoutStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { status, updatedBy } = req.body;

        const checkout = await UpdateCheckoutStatus(
            req.params.id,
            status,
            updatedBy
        );

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: "Checkout not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Checkout status updated successfully",
            data: checkout
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Checkout
export const DeleteCheckoutController = async (
    req: Request,
    res: Response
) => {
    try {
        const checkout = await DeleteCheckout(req.params.id);

        if (!checkout) {
            return res.status(404).json({
                success: false,
                message: "Checkout not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Checkout deleted successfully",
            data: checkout
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};