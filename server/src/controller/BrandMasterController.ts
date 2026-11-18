
import { Request, Response } from "express";
import {
    CreateBrand,
    GetAllBrands,
    GetBrandById,
    UpdateBrand,
    DeleteBrand,
    ChangeActiveStatus
} from "../Services/BrandServices";

// Create Brand
export const CreateBrandController = async (req: Request, res: Response) => {
    try {
        const { brandLogo: _brandLogo, ...brandData } = req.body;
        const brand = await CreateBrand(brandData);

        return res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data: brand
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Brands
export const GetAllBrandsController = async (req: Request, res: Response) => {
    try {
        const brands = await GetAllBrands();

        return res.status(200).json({
            success: true,
            message: "Brands fetched successfully",
            data: brands
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Brand By ID
export const GetBrandByIdController = async (req: Request, res: Response) => {
    try {
        const brand = await GetBrandById(req.params.id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Brand fetched successfully",
            data: brand
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Brand
export const UpdateBrandController = async (req: Request, res: Response) => {
    try {
        const { brandLogo: _brandLogo, ...brandData } = req.body;
        const brand = await UpdateBrand(req.params.id, brandData);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Brand updated successfully",
            data: brand
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Brand
export const DeleteBrandController = async (req: Request, res: Response) => {
    try {
        const brand = await DeleteBrand(req.params.id, req.body.updatedBy);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Brand deleted successfully",
            data: brand
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangeActiveStatusController = async (req: Request, res: Response) => {
    try {
        const brand = await ChangeActiveStatus(
            req.params.id,
            req.body.isActive,
            req.body.updatedBy
        );

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Brand status changed successfully",
            data: brand
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
