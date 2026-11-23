import { Request, Response } from "express";
import { createBanner, getAllBanners, getBannerById, updateBanner, deleteBanner, changeBannerStatus } from "../Services/BannerMasterServices";
import { getRequestActor, pickAllowed } from "../utils/audit";
import { ApiError, assertFound, sendError, sendSuccess } from "../utils/http";
import { parseListQuery } from "../utils/query";

const createFields = ["BannerImg", "BannerTitle", "BannerSubTitle", "isActive", "createdBy", "updatedBy"];
const updateFields = ["BannerImg", "BannerTitle", "BannerSubTitle", "isActive", "updatedBy"];

export const createBannerController = async (req: Request, res: Response) => {
  try {
    const actor = getRequestActor(req, req.body?.createdBy);
    const payload = pickAllowed(req.body || {}, createFields);
    if (!payload.BannerImg || !String(payload.BannerImg).trim()) throw new ApiError(400, "Banner image is required");
    if (!payload.BannerTitle || !String(payload.BannerTitle).trim()) throw new ApiError(400, "Banner title is required");
    if (!payload.BannerSubTitle || !String(payload.BannerSubTitle).trim()) throw new ApiError(400, "Banner subtitle is required");
    payload.BannerImg = String(payload.BannerImg).trim();
    payload.BannerTitle = String(payload.BannerTitle).trim();
    payload.BannerSubTitle = String(payload.BannerSubTitle).trim();
    payload.createdBy = actor; payload.updatedBy = actor;
    const banner = await createBanner(payload as any);
    return sendSuccess(res, 201, "Banner created successfully", banner);
  } catch (error) { return sendError(res, error); }
};

export const getAllBannersController = async (req: Request, res: Response) => {
  try {
    const result = await getAllBanners(parseListQuery(req, { sort: { createdAt: -1 } }) as any);
    if (Array.isArray(result)) return sendSuccess(res, 200, "Banners fetched successfully", result);
    return sendSuccess(res, 200, "Banners fetched successfully", result.items, result.meta);
  } catch (error) { return sendError(res, error); }
};

export const getBannerByIdController = async (req: Request, res: Response) => {
  try { return sendSuccess(res, 200, "Banner fetched successfully", assertFound(await getBannerById(req.params.id), "Banner not found")); }
  catch (error) { return sendError(res, error); }
};

export const updateBannerController = async (req: Request, res: Response) => {
  try {
    const actor = getRequestActor(req, req.body?.updatedBy);
    const payload = pickAllowed(req.body || {}, updateFields);
    for (const k of ["BannerImg", "BannerTitle", "BannerSubTitle"]) if (payload[k] !== undefined) payload[k] = String(payload[k]).trim();
    if (Object.prototype.hasOwnProperty.call(payload, "BannerImg") && !payload.BannerImg) throw new ApiError(400, "Banner image is required");
    if (Object.prototype.hasOwnProperty.call(payload, "BannerTitle") && !payload.BannerTitle) throw new ApiError(400, "Banner title is required");
    if (Object.prototype.hasOwnProperty.call(payload, "BannerSubTitle") && !payload.BannerSubTitle) throw new ApiError(400, "Banner subtitle is required");
    payload.updatedBy = actor;
    return sendSuccess(res, 200, "Banner updated successfully", assertFound(await updateBanner(req.params.id, payload as any), "Banner not found"));
  } catch (error) { return sendError(res, error); }
};

export const deleteBannerController = async (req: Request, res: Response) => {
  try { return sendSuccess(res, 200, "Banner deleted successfully", assertFound(await deleteBanner(req.params.id, getRequestActor(req, req.body?.updatedBy)), "Banner not found")); }
  catch (error) { return sendError(res, error); }
};

export const changeBannerStatusController = async (req: Request, res: Response) => {
  try {
    if (typeof req.body?.isActive !== "boolean") throw new ApiError(400, "isActive must be a boolean");
    return sendSuccess(res, 200, "Banner status changed successfully", assertFound(await changeBannerStatus(req.params.id, req.body.isActive, getRequestActor(req, req.body?.updatedBy)), "Banner not found"));
  } catch (error) { return sendError(res, error); }
};
