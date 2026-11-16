import { Request, Response } from "express";

import {
    CreateScaleSize,
    GetAllScaleSize,
    GetScaleSizeById,
    UpdateScaleSize,
    DeleteScaleSize,
    ChangeScaleSizeActiveStatus
} from "../Services/ScaleSizeServices";

// Create Scale Size
export const CreateScaleSizeController = async (
    req: Request,
    res: Response
) => {
    try {
        const scaleSize = await CreateScaleSize(req.body);

        return res.status(201).json({
            success: true,
            message: "Scale size created successfully",
            data: scaleSize
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Scale Sizes
export const GetAllScaleSizeController = async (
    req: Request,
    res: Response
) => {
    try {
        const scaleSizes = await GetAllScaleSize();

        return res.status(200).json({
            success: true,
            message: "Scale sizes fetched successfully",
            data: scaleSizes
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Scale Size By ID
export const GetScaleSizeByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const scaleSize = await GetScaleSizeById(req.params.id);

        if (!scaleSize) {
            return res.status(404).json({
                success: false,
                message: "Scale size not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Scale size fetched successfully",
            data: scaleSize
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Scale Size
export const UpdateScaleSizeController = async (
    req: Request,
    res: Response
) => {
    try {
        const scaleSize = await UpdateScaleSize(
            req.params.id,
            req.body
        );

        if (!scaleSize) {
            return res.status(404).json({
                success: false,
                message: "Scale size not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Scale size updated successfully",
            data: scaleSize
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Scale Size
export const DeleteScaleSizeController = async (
    req: Request,
    res: Response
) => {
    try {
        const { updatedBy } = req.body;

        const scaleSize = await DeleteScaleSize(
            req.params.id,
            updatedBy
        );

        if (!scaleSize) {
            return res.status(404).json({
                success: false,
                message: "Scale size not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Scale size deleted successfully",
            data: scaleSize
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangeScaleSizeActiveStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isActive, updatedBy } = req.body;

        const scaleSize = await ChangeScaleSizeActiveStatus(
            req.params.id,
            isActive,
            updatedBy
        );

        if (!scaleSize) {
            return res.status(404).json({
                success: false,
                message: "Scale size not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Scale size active status changed successfully",
            data: scaleSize
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};