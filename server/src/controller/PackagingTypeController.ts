import { Request, Response } from "express";
import { createPackagingType, getAllPackagingTypes, getPackagingTypeById, updatePackagingType, deletePackagingType, changePackagingTypeStatus } from "../Services/PackagingTypeServices";
import { getRequestActor, pickAllowed } from "../utils/audit";
import { ApiError, assertFound, sendError, sendSuccess } from "../utils/http";
import { parseListQuery } from "../utils/query";

const createFields = ["packagingName", "packaginName", "Description", "isActive", "createdBy", "updatedBy"];
const updateFields = ["packagingName", "packaginName", "Description", "isActive", "updatedBy"];

function normalizePayload(payload: any, required: boolean) {
  if (payload.packagingName === undefined && payload.packaginName !== undefined) payload.packagingName = payload.packaginName;
  if (payload.packagingName !== undefined) payload.packagingName = String(payload.packagingName).trim();
  if (payload.packaginName !== undefined) payload.packaginName = String(payload.packaginName).trim();
  if (payload.packagingName !== undefined) payload.packaginName = payload.packagingName;
  if (payload.Description !== undefined) payload.Description = String(payload.Description).trim();
  const name = payload.packagingName ?? payload.packaginName;
  if (required && !name) throw new ApiError(400, "Packaging name is required");
  if (!required && Object.prototype.hasOwnProperty.call(payload, "packagingName") && !name) throw new ApiError(400, "Packaging name is required");
  if (name) { payload.packagingName = name; payload.packaginName = name; }
}

export const createPackagingTypeController = async (req: Request, res: Response) => {
  try {
    const actor = getRequestActor(req, req.body?.createdBy);
    const payload = pickAllowed(req.body || {}, createFields);
    normalizePayload(payload, true);
    payload.createdBy = actor; payload.updatedBy = actor;
    return sendSuccess(res, 201, "Packaging type created successfully", await createPackagingType(payload as any));
  } catch (error) { return sendError(res, error); }
};

export const getAllPackagingTypesController = async (req: Request, res: Response) => {
  try {
    const result = await getAllPackagingTypes(parseListQuery(req, { sort: { createdAt: -1 } }) as any);
    if (Array.isArray(result)) return sendSuccess(res, 200, "Packaging types fetched successfully", result);
    return sendSuccess(res, 200, "Packaging types fetched successfully", result.items, result.meta);
  } catch (error) { return sendError(res, error); }
};

export const getPackagingTypeByIdController = async (req: Request, res: Response) => {
  try { return sendSuccess(res, 200, "Packaging type fetched successfully", assertFound(await getPackagingTypeById(req.params.id), "Packaging type not found")); }
  catch (error) { return sendError(res, error); }
};

export const updatePackagingTypeController = async (req: Request, res: Response) => {
  try {
    const actor = getRequestActor(req, req.body?.updatedBy);
    const payload = pickAllowed(req.body || {}, updateFields);
    normalizePayload(payload, false);
    payload.updatedBy = actor;
    return sendSuccess(res, 200, "Packaging type updated successfully", assertFound(await updatePackagingType(req.params.id, payload as any), "Packaging type not found"));
  } catch (error) { return sendError(res, error); }
};

export const deletePackagingTypeController = async (req: Request, res: Response) => {
  try { return sendSuccess(res, 200, "Packaging type deleted successfully", assertFound(await deletePackagingType(req.params.id, getRequestActor(req, req.body?.updatedBy)), "Packaging type not found")); }
  catch (error) { return sendError(res, error); }
};

export const changePackagingTypeStatusController = async (req: Request, res: Response) => {
  try {
    if (typeof req.body?.isActive !== "boolean") throw new ApiError(400, "isActive must be a boolean");
    return sendSuccess(res, 200, "Packaging type status changed successfully", assertFound(await changePackagingTypeStatus(req.params.id, req.body.isActive, getRequestActor(req, req.body?.updatedBy)), "Packaging type not found"));
  } catch (error) { return sendError(res, error); }
};
