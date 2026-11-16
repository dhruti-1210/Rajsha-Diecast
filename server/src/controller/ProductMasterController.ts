
import { Request, Response } from "express";
import {
    CreateProductMaster,
    GetAllProductMaster,
    GetProductMasterById,
    UpdateProductMaster,
    DeleteProductMaster,
    ChangeProductActiveStatus,
    ChangeProductDisplayStatus
} from "../Services/ProductServices";
import { ProductMasterInput } from "../Models/ProductMaster";

const normalizeProductImageField = (body: unknown): ProductMasterInput | null => {
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
        return null;
    }

    if (!Object.prototype.hasOwnProperty.call(body, "Image")) {
        return body as ProductMasterInput;
    }

    const image = (body as Record<string, unknown>).Image;
    if (typeof image === "string") {
        return { ...body, Image: [image] } as ProductMasterInput;
    }

    if (Array.isArray(image) && image.every((item) => typeof item === "string")) {
        return body as ProductMasterInput;
    }

    return null;
};

// Create Product
export const CreateProductMasterController = async (req: Request, res: Response) => {
    try {
        const productData = normalizeProductImageField(req.body);
        if (!productData) {
            return res.status(400).json({
                success: false,
                message: "Image must be a string or an array of strings"
            });
        }

        const product = await CreateProductMaster(productData);

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Products
export const GetAllProductMasterController = async (req: Request, res: Response) => {
    try {
        const products = await GetAllProductMaster();

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: products
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Product By ID
export const GetProductMasterByIdController = async (req: Request, res: Response) => {
    try {
        const product = await GetProductMasterById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Product
export const UpdateProductMasterController = async (req: Request, res: Response) => {
    try {
        const productData = normalizeProductImageField(req.body);
        if (!productData) {
            return res.status(400).json({
                success: false,
                message: "Image must be a string or an array of strings"
            });
        }

        const product = await UpdateProductMaster(req.params.id, productData);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Soft Delete Product
export const DeleteProductMasterController = async (req: Request, res: Response) => {
    try {
        const product = await DeleteProductMaster(
            req.params.id,
            req.body.updatedBy
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangeProductActiveStatusController = async (req: Request, res: Response) => {
    try {
        const product = await ChangeProductActiveStatus(
            req.params.id,
            req.body.isActive,
            req.body.updatedBy
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product active status changed successfully",
            data: product
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Display Status
export const ChangeProductDisplayStatusController = async (req: Request, res: Response) => {
    try {
        const product = await ChangeProductDisplayStatus(
            req.params.id,
            req.body.isDisplay,
            req.body.updatedBy
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product display status changed successfully",
            data: product
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
