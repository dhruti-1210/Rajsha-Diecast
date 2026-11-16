import { Request, Response } from "express";

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
    try {
        const cart = await CreateCart(req.body);

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
    try {
        const cart = await GetAllCart();

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
    try {
        const cart = await GetCartById(req.params.id);

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
    try {
        const cart = await UpdateCart(
            req.params.id,
            req.body
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
    try {
        const cart = await DeleteCart(req.params.id);

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