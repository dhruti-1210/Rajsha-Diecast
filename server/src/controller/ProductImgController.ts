import { Request, Response } from "express";

import {
    CreateProductImgMaster,
    GetAllProductImgMaster,
    GetProductImgMasterById,
    GetProductImgMasterByProductId,
    UpdateProductImgMaster,
    DeleteProductImgMaster,
    ChangeProductImgActiveStatus
} from "../Services/ProductImgServices";

// Create Product Image
export const CreateProductImgMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const productImg = await CreateProductImgMaster(req.body);

        return res.status(201).json({
            success: true,
            message: "Product image created successfully",
            data: productImg
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Product Images
export const GetAllProductImgMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const productImgs = await GetAllProductImgMaster();

        return res.status(200).json({
            success: true,
            message: "Product images fetched successfully",
            data: productImgs
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Product Image By ID
export const GetProductImgMasterByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const productImg = await GetProductImgMasterById(req.params.id);

        if (!productImg) {
            return res.status(404).json({
                success: false,
                message: "Product image not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product image fetched successfully",
            data: productImg
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Product Images By Product ID
export const GetProductImgMasterByProductIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const productImgs = await GetProductImgMasterByProductId(
            req.params.productId
        );

        return res.status(200).json({
            success: true,
            message: "Product images fetched successfully",
            data: productImgs
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Product Image
export const UpdateProductImgMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const productImg = await UpdateProductImgMaster(
            req.params.id,
            req.body
        );

        if (!productImg) {
            return res.status(404).json({
                success: false,
                message: "Product image not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product image updated successfully",
            data: productImg
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Product Image
export const DeleteProductImgMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const { deletedBy } = req.body;

        const productImg = await DeleteProductImgMaster(
            req.params.id,
            deletedBy
        );

        if (!productImg) {
            return res.status(404).json({
                success: false,
                message: "Product image not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product image deleted successfully",
            data: productImg
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangeProductImgActiveStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isActive, updatedBy } = req.body;

        const productImg = await ChangeProductImgActiveStatus(
            req.params.id,
            isActive,
            updatedBy
        );

        if (!productImg) {
            return res.status(404).json({
                success: false,
                message: "Product image not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product image active status changed successfully",
            data: productImg
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};