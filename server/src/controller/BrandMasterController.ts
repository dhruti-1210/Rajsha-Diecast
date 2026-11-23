import { Request, Response } from "express";
import {
    CreateBrand,
    GetAllBrands,
    GetBrandById,
    UpdateBrand,
    DeleteBrand,
    ChangeActiveStatus
} from "../Services/BrandServices";
import { getRequestActor, pickAllowed } from "../utils/audit";
import { ApiError, assertFound, sendError, sendSuccess } from "../utils/http";
import { parseListQuery } from "../utils/query";

const createFields = ["brandName", "modelCount", "scaleSize", "isActive", "createdBy", "updatedBy"];
const updateFields = ["brandName", "modelCount", "scaleSize", "isActive", "updatedBy"];

function normalizeBrandPayload(body: any, allowed: string[]) {
  const payload = pickAllowed(body || {}, allowed);
  if (payload.brandName !== undefined) payload.brandName = String(payload.brandName).trim();
  if (payload.modelCount !== undefined) payload.modelCount = Number(payload.modelCount);
  if (payload.scaleSize !== undefined) payload.scaleSize = Number(payload.scaleSize);
  return payload;
}

export const CreateBrandController = async (req: Request, res: Response) => {
    try {
        const actor = getRequestActor(req, req.body?.createdBy);
        const payload = normalizeBrandPayload(req.body, createFields);
        if (!payload.brandName) throw new ApiError(400, "Brand name is required");
        if (!Number.isInteger(payload.modelCount) || payload.modelCount < 0) throw new ApiError(400, "Model count must be a non-negative integer");
        if (!Number.isFinite(payload.scaleSize) || payload.scaleSize < 0) throw new ApiError(400, "Scale size must be a non-negative number");
        payload.createdBy = actor;
        payload.updatedBy = actor;
        const brand = await CreateBrand(payload as any);
        return sendSuccess(res, 201, "Brand created successfully", brand);
    } catch (error) {
        return sendError(res, error);
    }
};

export const GetAllBrandsController = async (req: Request, res: Response) => {
    try {
        const query = parseListQuery(req, { sort: { createdAt: -1 } });
        const result = await GetAllBrands(query as any);
        if (Array.isArray(result)) return sendSuccess(res, 200, "Brands fetched successfully", result);
        return sendSuccess(res, 200, "Brands fetched successfully", result.items, result.meta);
    } catch (error) {
        return sendError(res, error);
    }
};

export const GetBrandByIdController = async (req: Request, res: Response) => {
    try {
        const brand = assertFound(await GetBrandById(req.params.id), "Brand not found");
        return sendSuccess(res, 200, "Brand fetched successfully", brand);
    } catch (error) {
        return sendError(res, error);
    }
};

export const UpdateBrandController = async (req: Request, res: Response) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        const payload = normalizeBrandPayload(req.body, updateFields);
        if (payload.brandName !== undefined && !payload.brandName) throw new ApiError(400, "Brand name is required");
        if (payload.modelCount !== undefined && (!Number.isInteger(payload.modelCount) || payload.modelCount < 0)) throw new ApiError(400, "Model count must be a non-negative integer");
        if (payload.scaleSize !== undefined && (!Number.isFinite(payload.scaleSize) || payload.scaleSize < 0)) throw new ApiError(400, "Scale size must be a non-negative number");
        payload.updatedBy = actor;
        const brand = assertFound(await UpdateBrand(req.params.id, payload as any), "Brand not found");
        return sendSuccess(res, 200, "Brand updated successfully", brand);
    } catch (error) {
        return sendError(res, error);
    }
};

export const DeleteBrandController = async (req: Request, res: Response) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        const brand = assertFound(await DeleteBrand(req.params.id, actor), "Brand not found");
        return sendSuccess(res, 200, "Brand deleted successfully", brand);
    } catch (error) {
        return sendError(res, error);
    }
};

export const ChangeActiveStatusController = async (req: Request, res: Response) => {
    try {
        const actor = getRequestActor(req, req.body?.updatedBy);
        if (typeof req.body?.isActive !== "boolean") throw new ApiError(400, "isActive must be a boolean");
        const brand = assertFound(await ChangeActiveStatus(req.params.id, req.body.isActive, actor), "Brand not found");
        return sendSuccess(res, 200, "Brand status changed successfully", brand);
    } catch (error) {
        return sendError(res, error);
    }
};
