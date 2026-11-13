
import { Request, Response } from "express";
import {
    CreatePackagingType,
    GetAllPackagingTypes,
    GetPackagingTypeById,
    UpdatePackagingType,
    DeletePackagingType,
    ChangePackagingTypeActiveStatus
} from "../Services/PackagingTypeServices";

// Create Packaging Type
export const CreatePackagingTypeController = async (req: Request, res: Response) => {
    try {
        const packagingType = await CreatePackagingType(req.body);

        return res.status(201).json({
            success: true,
            message: "Packaging type created successfully",
            data: packagingType
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Packaging Types
export const GetAllPackagingTypesController = async (req: Request, res: Response) => {
    try {
        const packagingTypes = await GetAllPackagingTypes();

        return res.status(200).json({
            success: true,
            message: "Packaging types fetched successfully",
            data: packagingTypes
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Packaging Type By ID
export const GetPackagingTypeByIdController = async (req: Request, res: Response) => {
    try {
        const packagingType = await GetPackagingTypeById(req.params.id);

        if (!packagingType) {
            return res.status(404).json({
                success: false,
                message: "Packaging type not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Packaging type fetched successfully",
            data: packagingType
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Packaging Type
export const UpdatePackagingTypeController = async (req: Request, res: Response) => {
    try {
        const packagingType = await UpdatePackagingType(req.params.id, req.body);

        if (!packagingType) {
            return res.status(404).json({
                success: false,
                message: "Packaging type not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Packaging type updated successfully",
            data: packagingType
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Soft Delete Packaging Type
export const DeletePackagingTypeController = async (req: Request, res: Response) => {
    try {
        const packagingType = await DeletePackagingType(
            req.params.id,
            req.body.updatedBy
        );

        if (!packagingType) {
            return res.status(404).json({
                success: false,
                message: "Packaging type not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Packaging type deleted successfully",
            data: packagingType
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangePackagingTypeActiveStatusController = async (req: Request, res: Response) => {
    try {
        const packagingType = await ChangePackagingTypeActiveStatus(
            req.params.id,
            req.body.isActive,
            req.body.updatedBy
        );

        if (!packagingType) {
            return res.status(404).json({
                success: false,
                message: "Packaging type not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Packaging type active status changed successfully",
            data: packagingType
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
