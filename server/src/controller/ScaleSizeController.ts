import type { Request, Response } from "express";
import {
    CreateScaleSize,
    GetAllScaleSize,
    GetScaleSizeById,
    UpdateScaleSize,
    DeleteScaleSize,
    ChangeScaleSizeActiveStatus
} from "../Services/ScaleSizeServices";
import { getRequestActor, pickAllowed } from "../utils/audit";
import { ApiError, assertFound, sendError, sendSuccess } from "../utils/http";
import { parseListQuery } from "../utils/query";

const createFields = ["ScaleSize", "isActive", "createdBy", "updatedBy"];
const updateFields = ["ScaleSize", "isActive", "updatedBy"];

export const CreateScaleSizeController = async (req: Request, res: Response) => {
    try {
        const actor = getRequestActor(req, req.body?.createdBy);
        const payload = pickAllowed(req.body || {}, createFields);
        if (!payload.ScaleSize || !String(payload.ScaleSize).trim()) throw new ApiError(400, "Scale size is required");
        payload.ScaleSize = String(payload.ScaleSize).trim();
        payload.createdBy = actor;
        payload.updatedBy = actor;
        const scaleSize = await CreateScaleSize(payload as any);
        return sendSuccess(res, 201, "Scale size created successfully", scaleSize);
    } catch (error) {
        return sendError(res, error);
    }
};

export const GetAllScaleSizeController = async (req: Request, res: Response) => {
    try {
        const query = parseListQuery(req, { sort: { createdAt: -1 } });
        const result = await GetAllScaleSize(query as any);
        if (Array.isArray(result)) return sendSuccess(res, 200, "Scale sizes fetched successfully", result);
        return sendSuccess(res, 200, "Scale sizes fetched successfully", result.items, result.meta);
    } catch (error) {
        return sendError(res, error);
    }
};

export const GetScaleSizeByIdController = async (req: Request, res: Response) => {
    try {
        const scaleSize = assertFound(await GetScaleSizeById(req.params.id), "Scale size not found");
        return sendSuccess(res, 200, "Scale size fetched successfully", scaleSize);
    } catch (error) {
        return sendError(res, error);
    }
};

export const UpdateScaleSizeController = async (req: Request, res: Response) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        const payload = pickAllowed(req.body || {}, updateFields);
        if (payload.ScaleSize !== undefined) {
            if (!String(payload.ScaleSize).trim()) throw new ApiError(400, "Scale size is required");
            payload.ScaleSize = String(payload.ScaleSize).trim();
        }
        payload.updatedBy = actor;
        const scaleSize = assertFound(await UpdateScaleSize(req.params.id, payload as any), "Scale size not found");
        return sendSuccess(res, 200, "Scale size updated successfully", scaleSize);
    } catch (error) {
        return sendError(res, error);
    }
};

export const DeleteScaleSizeController = async (req: Request, res: Response) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        const scaleSize = assertFound(await DeleteScaleSize(req.params.id, actor), "Scale size not found");
        return sendSuccess(res, 200, "Scale size deleted successfully", scaleSize);
    } catch (error) {
        return sendError(res, error);
    }
};

export const ChangeScaleSizeActiveStatusController = async (req: Request, res: Response) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        if (typeof req.body?.isActive !== "boolean") throw new ApiError(400, "isActive must be a boolean");
        const scaleSize = assertFound(await ChangeScaleSizeActiveStatus(req.params.id, req.body.isActive, actor), "Scale size not found");
        return sendSuccess(res, 200, "Scale size active status changed successfully", scaleSize);
    } catch (error) {
        return sendError(res, error);
    }
};
