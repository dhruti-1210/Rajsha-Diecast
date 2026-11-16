import { Request, Response } from "express";

import {
    CreateFooterLinkGroup,
    GetAllFooterLinkGroup,
    GetFooterLinkGroupById,
    UpdateFooterLinkGroup,
    DeleteFooterLinkGroup,
    ChangeFooterLinkGroupActiveStatus
} from "../Services/footerLinkGroupServices";

// Create Footer Link Group
export const CreateFooterLinkGroupController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLinkGroup = await CreateFooterLinkGroup(req.body);

        return res.status(201).json({
            success: true,
            message: "Footer link group created successfully",
            data: footerLinkGroup
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Footer Link Groups
export const GetAllFooterLinkGroupController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLinkGroups = await GetAllFooterLinkGroup();

        return res.status(200).json({
            success: true,
            message: "Footer link groups fetched successfully",
            data: footerLinkGroups
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get Footer Link Group By ID
export const GetFooterLinkGroupByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLinkGroup = await GetFooterLinkGroupById(
            req.params.id
        );

        if (!footerLinkGroup) {
            return res.status(404).json({
                success: false,
                message: "Footer link group not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Footer link group fetched successfully",
            data: footerLinkGroup
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Update Footer Link Group
export const UpdateFooterLinkGroupController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLinkGroup = await UpdateFooterLinkGroup(
            req.params.id,
            req.body
        );

        if (!footerLinkGroup) {
            return res.status(404).json({
                success: false,
                message: "Footer link group not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Footer link group updated successfully",
            data: footerLinkGroup
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Delete Footer Link Group
export const DeleteFooterLinkGroupController = async (
    req: Request,
    res: Response
) => {
    try {
        const { updatedBy } = req.body;

        const footerLinkGroup = await DeleteFooterLinkGroup(
            req.params.id,
            updatedBy
        );

        if (!footerLinkGroup) {
            return res.status(404).json({
                success: false,
                message: "Footer link group not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Footer link group deleted successfully",
            data: footerLinkGroup
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Change Active Status
export const ChangeFooterLinkGroupActiveStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const { isActive, updatedBy } = req.body;

        const footerLinkGroup = await ChangeFooterLinkGroupActiveStatus(
            req.params.id,
            isActive,
            updatedBy
        );

        if (!footerLinkGroup) {
            return res.status(404).json({
                success: false,
                message: "Footer link group not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Footer link group status changed successfully",
            data: footerLinkGroup
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};