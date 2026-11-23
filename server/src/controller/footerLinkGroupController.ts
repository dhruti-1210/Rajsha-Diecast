import type { Request, Response } from "express";

import {
    CreateFooterLinkGroup,
    GetAllFooterLinkGroup,
    GetFooterLinkGroupById,
    UpdateFooterLinkGroup,
    DeleteFooterLinkGroup,
    ChangeFooterLinkGroupActiveStatus,
    ChangeFooterLinkGroupDisplayStatus
} from "../Services/footerLinkGroupServices";
import { getRequestActor, pickAllowed } from "../utils/audit";
import { ApiError, assertFound, sendError, sendSuccess } from "../utils/http";
import { parseListQuery } from "../utils/query";

const createFields = ["FooterLinkGroupName", "isActive", "isDisplay", "createdBy", "updatedBy"];
const updateFields = ["FooterLinkGroupName", "isActive", "isDisplay", "updatedBy"];

// Create Footer Link Group
export const CreateFooterLinkGroupController = async (
    req: Request,
    res: Response
) => {
    try {
        const actor = getRequestActor(req, req.body?.createdBy);
        const payload = pickAllowed(req.body || {}, createFields);
        if (!payload.FooterLinkGroupName || !String(payload.FooterLinkGroupName).trim()) {
            throw new ApiError(400, "Footer link group name is required");
        }
        payload.FooterLinkGroupName = String(payload.FooterLinkGroupName).trim();
        payload.createdBy = actor;
        payload.updatedBy = actor;

        const footerLinkGroup = await CreateFooterLinkGroup(payload as any);
        return sendSuccess(res, 201, "Footer link group created successfully", footerLinkGroup);
    } catch (error) {
        return sendError(res, error);
    }
};

// Get All Footer Link Groups
export const GetAllFooterLinkGroupController = async (
    req: Request,
    res: Response
) => {
    try {
        const query = parseListQuery(req, { sort: { createdAt: -1 } });
        const result = await GetAllFooterLinkGroup(query as any);
        if (Array.isArray(result)) {
            return sendSuccess(res, 200, "Footer link groups fetched successfully", result);
        }
        return sendSuccess(res, 200, "Footer link groups fetched successfully", result.items, result.meta);
    } catch (error) {
        return sendError(res, error);
    }
};

// Get Footer Link Group By ID
export const GetFooterLinkGroupByIdController = async (
    req: Request,
    res: Response
) => {
    try {
        const footerLinkGroup = assertFound(
            await GetFooterLinkGroupById(req.params.id),
            "Footer link group not found"
        );
        return sendSuccess(res, 200, "Footer link group fetched successfully", footerLinkGroup);
    } catch (error) {
        return sendError(res, error);
    }
};

// Update Footer Link Group
export const UpdateFooterLinkGroupController = async (
    req: Request,
    res: Response
) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        const payload = pickAllowed(req.body || {}, updateFields);
        if (payload.FooterLinkGroupName !== undefined) {
            if (!String(payload.FooterLinkGroupName).trim()) throw new ApiError(400, "Footer link group name is required");
            payload.FooterLinkGroupName = String(payload.FooterLinkGroupName).trim();
        }
        payload.updatedBy = actor;

        const footerLinkGroup = assertFound(
            await UpdateFooterLinkGroup(req.params.id, payload as any),
            "Footer link group not found"
        );
        return sendSuccess(res, 200, "Footer link group updated successfully", footerLinkGroup);
    } catch (error) {
        return sendError(res, error);
    }
};

// Delete Footer Link Group
export const DeleteFooterLinkGroupController = async (
    req: Request,
    res: Response
) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        const footerLinkGroup = assertFound(
            await DeleteFooterLinkGroup(req.params.id, actor),
            "Footer link group not found"
        );
        return sendSuccess(res, 200, "Footer link group deleted successfully", footerLinkGroup);
    } catch (error) {
        return sendError(res, error);
    }
};

// Change Active Status
export const ChangeFooterLinkGroupActiveStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        if (typeof req.body?.isActive !== "boolean") throw new ApiError(400, "isActive must be a boolean");
        const footerLinkGroup = assertFound(
            await ChangeFooterLinkGroupActiveStatus(req.params.id, req.body.isActive, actor),
            "Footer link group not found"
        );
        return sendSuccess(res, 200, "Footer link group status changed successfully", footerLinkGroup);
    } catch (error) {
        return sendError(res, error);
    }
};

// Change Display Status
export const ChangeFooterLinkGroupDisplayStatusController = async (
    req: Request,
    res: Response
) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        if (typeof req.body?.isDisplay !== "boolean") throw new ApiError(400, "isDisplay must be a boolean");
        const footerLinkGroup = assertFound(
            await ChangeFooterLinkGroupDisplayStatus(req.params.id, req.body.isDisplay, actor),
            "Footer link group not found"
        );
        return sendSuccess(res, 200, "Footer link group display status changed successfully", footerLinkGroup);
    } catch (error) {
        return sendError(res, error);
    }
};
