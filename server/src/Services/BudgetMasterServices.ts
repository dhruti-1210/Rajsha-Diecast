import BudgetMaster, { IBudgetMaster } from "../Models/BudgetMaster";
import { findActiveById, listDocuments, setActiveStatusById, softDeleteById, updateActiveById } from "../utils/crudService";

export const createBudget = async (data: Partial<IBudgetMaster>) => await new BudgetMaster(data).save();
export const getAllBudgets = async (query?: any) => await listDocuments(BudgetMaster, query, { searchFields: [] });
export const getBudgetById = async (id: string) => await findActiveById(BudgetMaster, id);
export const updateBudget = async (id: string, data: Partial<IBudgetMaster>) => await updateActiveById(BudgetMaster, id, { ...data });
export const deleteBudget = async (id: string, updatedBy: string) => await softDeleteById(BudgetMaster, id, updatedBy);
export const changeBudgetStatus = async (id: string, isActive: boolean, updatedBy: string) => await setActiveStatusById(BudgetMaster, id, isActive, updatedBy);
