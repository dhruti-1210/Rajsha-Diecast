import { Request, Response } from "express";
import { createCms, getAllCms, getCmsById, updateCms, deleteCms, changeCmsStatus, changeCmsDisplayStatus } from "../Services/CMSMasterServices";
import { getRequestActor, pickAllowed } from "../utils/audit";
import { ApiError, assertFound, sendError, sendSuccess } from "../utils/http";
import { parseListQuery } from "../utils/query";

const createFields = ["Name", "Description", "isActive", "isDisplay", "createdBy", "updatedBy"];
const updateFields = ["Name", "Description", "isActive", "isDisplay", "updatedBy"];

export const createCmsController = async (req: Request, res: Response) => {
  try {
    const actor = getRequestActor(req, req.body?.createdBy);
    const payload = pickAllowed(req.body || {}, createFields);
    if (!payload.Name || !String(payload.Name).trim()) throw new ApiError(400, "Name is required");
    payload.Name = String(payload.Name).trim();
    if (payload.Description !== undefined) payload.Description = String(payload.Description);
    payload.createdBy = actor; payload.updatedBy = actor;
    return sendSuccess(res, 201, "CMS created successfully", await createCms(payload as any));
  } catch (error) { return sendError(res, error); }
};

export const getAllCmsController = async (req: Request, res: Response) => {
  try {
    const result = await getAllCms(parseListQuery(req, { sort: { createdAt: -1 } }) as any);
    if (Array.isArray(result)) return sendSuccess(res, 200, "CMS fetched successfully", result);
    return sendSuccess(res, 200, "CMS fetched successfully", result.items, result.meta);
  } catch (error) { return sendError(res, error); }
};

export const getCmsByIdController = async (req: Request, res: Response) => {
  try { return sendSuccess(res, 200, "CMS fetched successfully", assertFound(await getCmsById(req.params.id), "CMS not found")); }
  catch (error) { return sendError(res, error); }
};

export const updateCmsController = async (req: Request, res: Response) => {
  try {
    const actor = getRequestActor(req, req.body?.updatedBy);
    const payload = pickAllowed(req.body || {}, updateFields);
    if (payload.Name !== undefined) { payload.Name = String(payload.Name).trim(); if (!payload.Name) throw new ApiError(400, "Name is required"); }
    if (payload.Description !== undefined) payload.Description = String(payload.Description);
    payload.updatedBy = actor;
    return sendSuccess(res, 200, "CMS updated successfully", assertFound(await updateCms(req.params.id, payload as any), "CMS not found"));
  } catch (error) { return sendError(res, error); }
};

export const deleteCmsController = async (req: Request, res: Response) => {
  try { return sendSuccess(res, 200, "CMS deleted successfully", assertFound(await deleteCms(req.params.id, getRequestActor(req, req.body?.updatedBy)), "CMS not found")); }
  catch (error) { return sendError(res, error); }
};

export const changeCmsStatusController = async (req: Request, res: Response) => {
  try {
    if (typeof req.body?.isActive !== "boolean") throw new ApiError(400, "isActive must be a boolean");
    return sendSuccess(res, 200, "CMS status changed successfully", assertFound(await changeCmsStatus(req.params.id, req.body.isActive, getRequestActor(req, req.body?.updatedBy)), "CMS not found"));
  } catch (error) { return sendError(res, error); }
};

export const changeCmsDisplayStatusController = async (req: Request, res: Response) => {
  try {
    if (typeof req.body?.isDisplay !== "boolean") throw new ApiError(400, "isDisplay must be a boolean");
    return sendSuccess(res, 200, "CMS display status changed successfully", assertFound(await changeCmsDisplayStatus(req.params.id, req.body.isDisplay, getRequestActor(req, req.body?.updatedBy)), "CMS not found"));
  } catch (error) { return sendError(res, error); }
};
