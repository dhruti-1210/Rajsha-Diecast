import { Request, Response } from "express";
import { createCollectionType, getAllCollectionTypes, getCollectionTypeById, updateCollectionType, deleteCollectionType, changeCollectionTypeStatus, changeCollectionTypeDisplayStatus } from "../Services/CollectionMasterServices";
import { getRequestActor, pickAllowed } from "../utils/audit";
import { ApiError, assertFound, sendError, sendSuccess } from "../utils/http";
import { parseListQuery } from "../utils/query";

const createFields = ["collectionName", "collectionDescription", "image", "sortOrder", "displayOnHomepage", "isActive", "isDisplay", "createdBy", "updatedBy"];
const updateFields = ["collectionName", "collectionDescription", "image", "sortOrder", "displayOnHomepage", "isActive", "isDisplay", "updatedBy"];

export const createCollectionTypeController = async (req: Request, res: Response) => {
  try {
    const actor = getRequestActor(req, req.body?.createdBy);
    const payload = pickAllowed(req.body || {}, createFields);
    if (!payload.collectionName || !String(payload.collectionName).trim()) throw new ApiError(400, "Collection name is required");
    payload.collectionName = String(payload.collectionName).trim();
    if (payload.collectionDescription !== undefined) payload.collectionDescription = String(payload.collectionDescription).trim();
    if (payload.image !== undefined) payload.image = String(payload.image).trim();
    if (payload.sortOrder !== undefined) payload.sortOrder = Number(payload.sortOrder);
    if (payload.sortOrder !== undefined && !Number.isFinite(payload.sortOrder)) throw new ApiError(400, "sortOrder must be a number");
    payload.createdBy = actor; payload.updatedBy = actor;
    return sendSuccess(res, 201, "Collection Type created successfully", await createCollectionType(payload as any));
  } catch (error) { return sendError(res, error); }
};

export const getAllCollectionTypesController = async (req: Request, res: Response) => {
  try {
    const result = await getAllCollectionTypes(parseListQuery(req, { sort: { sortOrder: 1, createdAt: -1 } }) as any);
    if (Array.isArray(result)) return sendSuccess(res, 200, "Collection Types fetched successfully", result);
    return sendSuccess(res, 200, "Collection Types fetched successfully", result.items, result.meta);
  } catch (error) { return sendError(res, error); }
};

export const getCollectionTypeByIdController = async (req: Request, res: Response) => {
  try { return sendSuccess(res, 200, "Collection Type fetched successfully", assertFound(await getCollectionTypeById(req.params.id), "Collection Type not found")); }
  catch (error) { return sendError(res, error); }
};

export const updateCollectionTypeController = async (req: Request, res: Response) => {
  try {
    const actor = getRequestActor(req, req.body?.updatedBy);
    const payload = pickAllowed(req.body || {}, updateFields);
    if (payload.collectionName !== undefined) { payload.collectionName = String(payload.collectionName).trim(); if (!payload.collectionName) throw new ApiError(400, "Collection name is required"); }
    if (payload.collectionDescription !== undefined) payload.collectionDescription = String(payload.collectionDescription).trim();
    if (payload.image !== undefined) payload.image = String(payload.image).trim();
    if (payload.sortOrder !== undefined) { payload.sortOrder = Number(payload.sortOrder); if (!Number.isFinite(payload.sortOrder)) throw new ApiError(400, "sortOrder must be a number"); }
    payload.updatedBy = actor;
    return sendSuccess(res, 200, "Collection Type updated successfully", assertFound(await updateCollectionType(req.params.id, payload as any), "Collection Type not found"));
  } catch (error) { return sendError(res, error); }
};

export const deleteCollectionTypeController = async (req: Request, res: Response) => {
  try { return sendSuccess(res, 200, "Collection Type deleted successfully", assertFound(await deleteCollectionType(req.params.id, getRequestActor(req, req.body?.updatedBy)), "Collection Type not found")); }
  catch (error) { return sendError(res, error); }
};

export const changeCollectionTypeStatusController = async (req: Request, res: Response) => {
  try {
    if (typeof req.body?.isActive !== "boolean") throw new ApiError(400, "isActive must be a boolean");
    return sendSuccess(res, 200, "Collection Type status changed successfully", assertFound(await changeCollectionTypeStatus(req.params.id, req.body.isActive, getRequestActor(req, req.body?.updatedBy)), "Collection Type not found"));
  } catch (error) { return sendError(res, error); }
};

export const changeCollectionTypeDisplayStatusController = async (req: Request, res: Response) => {
  try {
    if (typeof req.body?.isDisplay !== "boolean") throw new ApiError(400, "isDisplay must be a boolean");
    return sendSuccess(res, 200, "Collection Type display status changed successfully", assertFound(await changeCollectionTypeDisplayStatus(req.params.id, req.body.isDisplay, getRequestActor(req, req.body?.updatedBy)), "Collection Type not found"));
  } catch (error) { return sendError(res, error); }
};
