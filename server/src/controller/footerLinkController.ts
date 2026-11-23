import type { Request, Response } from "express";

import {
    CreateFooterLinkMaster,
    GetAllFooterLinkMaster,
    GetFooterLinkMasterById,
    UpdateFooterLinkMaster,
    DeleteFooterLinkMaster,
    ChangeFooterLinkMasterActiveStatus,
    ChangeFooterLinkMasterDisplayStatus
} from "../Services/footerLinkServices";
import { getRequestActor, pickAllowed } from "../utils/audit";
import { ApiError, assertFound, sendError, sendSuccess } from "../utils/http";
import { parseListQuery } from "../utils/query";

const createFields = ["FooterLinkGroupId", "FooterLinkName", "FooterLinkUrl", "isActive", "isDisplay", "createdBy", "updatedBy"];
const updateFields = ["FooterLinkGroupId", "FooterLinkName", "FooterLinkUrl", "isActive", "isDisplay", "updatedBy"];

// Create Footer Link
export const CreateFooterLinkMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const actor = getRequestActor(req, req.body?.createdBy);
        const payload = pickAllowed(req.body || {}, createFields);
        if (!payload.FooterLinkGroupId) throw new ApiError(400, "Footer link group is required");
        if (!payload.FooterLinkName || !String(payload.FooterLinkName).trim()) throw new ApiError(400, "Footer link name is required");
        if (!payload.FooterLinkUrl || !String(payload.FooterLinkUrl).trim()) throw new ApiError(400, "Footer link URL is required");
        payload.FooterLinkName = String(payload.FooterLinkName).trim();
        payload.FooterLinkUrl = String(payload.FooterLinkUrl).trim();
        payload.createdBy = actor;
        payload.updatedBy = actor;

        const footerLink = await CreateFooterLinkMaster(payload);
        return sendSuccess(res, 201, "Footer link created successfully", footerLink);
    } catch (error) {
        return sendError(res, error);
    }
};

// Get All Footer Links
export const GetAllFooterLinkMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const query = parseListQuery(req, { sort: { createdAt: -1 } }) as any;
        if (typeof req.query.FooterLinkGroupId === "string") query.FooterLinkGroupId = req.query.FooterLinkGroupId;
        const result = await GetAllFooterLinkMaster(query);
        if (Array.isArray(result)) {
            return sendSuccess(res, 200, "Footer links fetched successfully", result);
        }
        return sendSuccess(res, 200, "Footer links fetched successfully", result.items, result.meta);
    } catch (error) {
        return sendError(res, error);
    }
};

// Get Footer Link By ID
export const GetFooterLinkMasterByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLink = assertFound(
            await GetFooterLinkMasterById(req.params.id),
            "Footer link not found"
        );
        return sendSuccess(res, 200, "Footer link fetched successfully", footerLink);
    } catch (error) {
        return sendError(res, error);
    }
};

// Update Footer Link
export const UpdateFooterLinkMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        const payload = pickAllowed(req.body || {}, updateFields);
        if (payload.FooterLinkName !== undefined) {
            if (!String(payload.FooterLinkName).trim()) throw new ApiError(400, "Footer link name is required");
            payload.FooterLinkName = String(payload.FooterLinkName).trim();
        }
        if (payload.FooterLinkUrl !== undefined) {
            if (!String(payload.FooterLinkUrl).trim()) throw new ApiError(400, "Footer link URL is required");
            payload.FooterLinkUrl = String(payload.FooterLinkUrl).trim();
        }
        payload.updatedBy = actor;

        const footerLink = assertFound(
            await UpdateFooterLinkMaster(req.params.id, payload),
            "Footer link not found"
        );
        return sendSuccess(res, 200, "Footer link updated successfully", footerLink);
    } catch (error) {
        return sendError(res, error);
    }
};

// Soft Delete Footer Link
export const DeleteFooterLinkMasterController = async (
    req: Request,
    res: Response
) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        const footerLink = assertFound(
            await DeleteFooterLinkMaster(req.params.id, actor),
            "Footer link not found"
        );
        return sendSuccess(res, 200, "Footer link deleted successfully", footerLink);
    } catch (error) {
        return sendError(res, error);
    }
};

// Change Active Status
export const ChangeFooterLinkMasterActiveStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        if (typeof req.body?.isActive !== "boolean") throw new ApiError(400, "isActive must be a boolean");
        const footerLink = assertFound(
            await ChangeFooterLinkMasterActiveStatus(req.params.id, req.body.isActive, actor),
            "Footer link not found"
        );
        return sendSuccess(res, 200, "Footer link active status changed successfully", footerLink);
    } catch (error) {
        return sendError(res, error);
    }
};

// Change Display Status
export const ChangeFooterLinkMasterDisplayStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        if (typeof req.body?.isDisplay !== "boolean") throw new ApiError(400, "isDisplay must be a boolean");
        const footerLink = assertFound(
            await ChangeFooterLinkMasterDisplayStatus(req.params.id, req.body.isDisplay, actor),
            "Footer link not found"
        );
        return sendSuccess(res, 200, "Footer link display status changed successfully", footerLink);
    } catch (error) {
        return sendError(res, error);
    }
};
