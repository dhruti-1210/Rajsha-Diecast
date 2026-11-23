import { Request, Response } from "express";
import { createBudget, getAllBudgets, getBudgetById, updateBudget, deleteBudget, changeBudgetStatus } from "../Services/BudgetMasterServices";
import { getRequestActor, pickAllowed } from "../utils/audit";
import { ApiError, assertFound, sendError, sendSuccess } from "../utils/http";
import { parseListQuery } from "../utils/query";

const createFields = ["minAmount", "maxAmount", "isActive", "createdBy", "updatedBy"];
const updateFields = ["minAmount", "maxAmount", "isActive", "updatedBy"];

function normalizeBudgetPayload(payload: any, required: boolean) {
  if (payload.minAmount !== undefined) payload.minAmount = Number(payload.minAmount);
  if (payload.maxAmount !== undefined && payload.maxAmount !== null && payload.maxAmount !== "") payload.maxAmount = Number(payload.maxAmount);
  else if (payload.maxAmount === "" || payload.maxAmount === null) payload.maxAmount = undefined;
  if (required && !Number.isFinite(payload.minAmount)) throw new ApiError(400, "Minimum amount is required");
  if (payload.minAmount !== undefined && (!Number.isFinite(payload.minAmount) || payload.minAmount < 0)) throw new ApiError(400, "Minimum amount must be a valid non-negative number");
  if (payload.maxAmount !== undefined && (!Number.isFinite(payload.maxAmount) || payload.maxAmount < 0)) throw new ApiError(400, "Maximum amount must be a valid non-negative number");
  if (Number.isFinite(payload.minAmount) && Number.isFinite(payload.maxAmount) && payload.maxAmount < payload.minAmount) throw new ApiError(400, "Maximum amount must be greater than or equal to minimum amount");
}

export const createBudgetController = async (req: Request, res: Response) => {
  try {
    const actor = getRequestActor(req, req.body?.createdBy);
    const payload = pickAllowed(req.body || {}, createFields);
    normalizeBudgetPayload(payload, true);
    payload.createdBy = actor; payload.updatedBy = actor;
    return sendSuccess(res, 201, "Budget created successfully", await createBudget(payload as any));
  } catch (error) { return sendError(res, error); }
};

export const getAllBudgetsController = async (req: Request, res: Response) => {
  try {
    const result = await getAllBudgets(parseListQuery(req, { sort: { minAmount: 1, createdAt: -1 } }) as any);
    if (Array.isArray(result)) return sendSuccess(res, 200, "Budgets fetched successfully", result);
    return sendSuccess(res, 200, "Budgets fetched successfully", result.items, result.meta);
  } catch (error) { return sendError(res, error); }
};

export const getBudgetByIdController = async (req: Request, res: Response) => {
  try { return sendSuccess(res, 200, "Budget fetched successfully", assertFound(await getBudgetById(req.params.id), "Budget not found")); }
  catch (error) { return sendError(res, error); }
};

export const updateBudgetController = async (req: Request, res: Response) => {
  try {
    const actor = getRequestActor(req, req.body?.updatedBy);
    const payload = pickAllowed(req.body || {}, updateFields);
    normalizeBudgetPayload(payload, false);
    payload.updatedBy = actor;
    return sendSuccess(res, 200, "Budget updated successfully", assertFound(await updateBudget(req.params.id, payload as any), "Budget not found"));
  } catch (error) { return sendError(res, error); }
};

export const deleteBudgetController = async (req: Request, res: Response) => {
  try { return sendSuccess(res, 200, "Budget deleted successfully", assertFound(await deleteBudget(req.params.id, getRequestActor(req, req.body?.updatedBy)), "Budget not found")); }
  catch (error) { return sendError(res, error); }
};

export const changeBudgetStatusController = async (req: Request, res: Response) => {
  try {
    if (typeof req.body?.isActive !== "boolean") throw new ApiError(400, "isActive must be a boolean");
    return sendSuccess(res, 200, "Budget status changed successfully", assertFound(await changeBudgetStatus(req.params.id, req.body.isActive, getRequestActor(req, req.body?.updatedBy)), "Budget not found"));
  } catch (error) { return sendError(res, error); }
};
