
import { Request, Response } from "express";

import {
    CreateFooterLinkMaster,
    GetAllFooterLinkMaster,
    GetFooterLinkMasterById,
    UpdateFooterLinkMaster,
    DeleteFooterLinkMaster,
    ChangeFooterLinkMasterActiveStatus,
    ChangeFooterLinkMasterDisplayStatus
} from "../Services/footerLinkServices";


// Create Footer Link
export const CreateFooterLinkMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLink = await CreateFooterLinkMaster(req.body);

        return res.status(201).json({
            success: true,
            message: "Footer link created successfully",
            data: footerLink
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Footer Links
export const GetAllFooterLinkMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLinks = await GetAllFooterLinkMaster();

        return res.status(200).json({
            success: true,
            message: "Footer links fetched successfully",
            data: footerLinks
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Footer Link By ID
export const GetFooterLinkMasterByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLink = await GetFooterLinkMasterById(req.params.id);

        if (!footerLink) {
            return res.status(404).json({
                success: false,
                message: "Footer link not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Footer link fetched successfully",
            data: footerLink
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Footer Link
export const UpdateFooterLinkMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLink = await UpdateFooterLinkMaster(
            req.params.id,
            req.body
        );

        if (!footerLink) {
            return res.status(404).json({
                success: false,
                message: "Footer link not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Footer link updated successfully",
            data: footerLink
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Soft Delete Footer Link
export const DeleteFooterLinkMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLink = await DeleteFooterLinkMaster(req.params.id);

        if (!footerLink) {
            return res.status(404).json({
                success: false,
                message: "Footer link not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Footer link deleted successfully",
            data: footerLink
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangeFooterLinkMasterActiveStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLink = await ChangeFooterLinkMasterActiveStatus(
            req.params.id,
            req.body.isActive,
            req.body.updatedBy
        );

        if (!footerLink) {
            return res.status(404).json({
                success: false,
                message: "Footer link not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Footer link active status changed successfully",
            data: footerLink
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Display Status
export const ChangeFooterLinkMasterDisplayStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLink = await ChangeFooterLinkMasterDisplayStatus(
            req.params.id,
            req.body.isDisplay,
            req.body.updatedBy
        );

        if (!footerLink) {
            return res.status(404).json({
                success: false,
                message: "Footer link not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Footer link display status changed successfully",
            data: footerLink
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
