
import { Request, Response } from "express";

import {
    createCms,
    getAllCms,
    getCmsById,
    updateCms,
    deleteCms,
    changeCmsStatus,
    changeCmsDisplayStatus
} from "../Services/CMSMasterServices";

// Create CMS
export const createCmsController = async (
    req: Request,
    res: Response
) => {
    try {
        const cms = await createCms(req.body);

        return res.status(201).json({
            success: true,
            message: "CMS created successfully",
            data: cms
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All CMS
export const getAllCmsController = async (
    req: Request,
    res: Response
) => {
    try {
        const cms = await getAllCms();

        return res.status(200).json({
            success: true,
            message: "CMS fetched successfully",
            data: cms
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get CMS By ID
export const getCmsByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const cms = await getCmsById(req.params.id);

        if (!cms) {
            return res.status(404).json({
                success: false,
                message: "CMS not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "CMS fetched successfully",
            data: cms
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update CMS
export const updateCmsController = async (
    req: Request,
    res: Response
) => {
    try {
        const cms = await updateCms(
            req.params.id,
            req.body
        );

        if (!cms) {
            return res.status(404).json({
                success: false,
                message: "CMS not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "CMS updated successfully",
            data: cms
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Soft Delete CMS
export const deleteCmsController = async (
    req: Request,
    res: Response
) => {
    try {
        const { updatedBy } = req.body;

        const cms = await deleteCms(
            req.params.id,
            updatedBy
        );

        if (!cms) {
            return res.status(404).json({
                success: false,
                message: "CMS not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "CMS deleted successfully",
            data: cms
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change CMS Status
export const changeCmsStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isActive, updatedBy } = req.body;

        const cms = await changeCmsStatus(
            req.params.id,
            isActive,
            updatedBy
        );

        if (!cms) {
            return res.status(404).json({
                success: false,
                message: "CMS not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "CMS status changed successfully",
            data: cms
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change CMS Display Status
export const changeCmsDisplayStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isDisplay, updatedBy } = req.body;

        const cms = await changeCmsDisplayStatus(
            req.params.id,
            isDisplay,
            updatedBy
        );

        if (!cms) {
            return res.status(404).json({
                success: false,
                message: "CMS not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "CMS display status changed successfully",
            data: cms
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
