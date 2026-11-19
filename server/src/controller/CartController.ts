import { Request, Response } from "express";
import mongoose from "mongoose";

import {
    CreateCart,
    GetAllCart,
    GetCartById,
    UpdateCart,
    DeleteCart
} from "../Services/CartService";

// Create Cart
export const CreateCartController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id;
    const productId = req.body?.Product_Id;
    const quantity = req.body?.Quantity ?? 1;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication is required." });
    }
    if (typeof productId !== "string" || !mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: "A valid product ID is required." });
    }
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
        return res.status(400).json({ success: false, message: "Quantity must be a positive whole number." });
    }

    try {
        const cart = await CreateCart(
            { Product_Id: new mongoose.Types.ObjectId(productId) },
            userId,
            quantity
        );

        return res.status(201).json({
            success: true,
            message: "Cart created successfully",
            data: cart
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Cart
export const GetAllCartController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication is required." });
    }

    try {
        const cart = await GetAllCart(userId);

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: cart
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Cart By ID
export const GetCartByIdController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication is required." });
    }

    try {
        const cart = await GetCartById(req.params.id, userId);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            data: cart
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Cart
export const UpdateCartController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id;
    const quantity = req.body?.Quantity;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication is required." });
    }
    if (!Number.isSafeInteger(quantity) || quantity < 1) {
        return res.status(400).json({ success: false, message: "Quantity must be a positive whole number." });
    }

    try {
        const cart = await UpdateCart(
            req.params.id,
            userId,
            { Quantity: quantity }
        );

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            data: cart
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//  Soft Delete Cart
export const DeleteCartController = async (
    req: Request,
    res: Response
) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication is required." });
    }

    try {
        const cart = await DeleteCart(req.params.id, userId);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart deleted successfully",
            data: cart
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};