
import { Request, Response } from "express";

import {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
    changeBannerStatus
} from "../Services/BannerMasterServices";

// Create Banner
export const createBannerController = async (
    req: Request,
    res: Response
) => {
    try {
        const banner = await createBanner(req.body);

        return res.status(201).json({
            success: true,
            message: "Banner created successfully",
            data: banner
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Banners
export const getAllBannersController = async (
    req: Request,
    res: Response
) => {
    try {
        const banners = await getAllBanners();

        return res.status(200).json({
            success: true,
            message: "Banners fetched successfully",
            data: banners
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Banner By ID
export const getBannerByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const banner = await getBannerById(req.params.id);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Banner fetched successfully",
            data: banner
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Banner
export const updateBannerController = async (
    req: Request,
    res: Response
) => {
    try {
        const banner = await updateBanner(
            req.params.id,
            req.body
        );

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: banner
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Soft Delete Banner
export const deleteBannerController = async (
    req: Request,
    res: Response
) => {
    try {
        const { updatedBy } = req.body;

        const banner = await deleteBanner(
            req.params.id,
            updatedBy
        );

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
            data: banner
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Banner Status
export const changeBannerStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isActive, updatedBy } = req.body;

        const banner = await changeBannerStatus(
            req.params.id,
            isActive,
            updatedBy
        );

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Banner status changed successfully",
            data: banner
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
