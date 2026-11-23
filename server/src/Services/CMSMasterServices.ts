import CmsMaster, { ICmsMaster } from "../Models/CmsMaster";
import { findActiveById, listDocuments, setActiveStatusById, setDisplayStatusById, softDeleteById, updateActiveById } from "../utils/crudService";

export const createCms = async (data: Partial<ICmsMaster>) => await new CmsMaster(data).save();
export const getAllCms = async (query?: any) => await listDocuments(CmsMaster, query, { searchFields: ["Name", "Description"] });
export const getCmsById = async (id: string) => await findActiveById(CmsMaster, id);
export const updateCms = async (id: string, data: Partial<ICmsMaster>) => await updateActiveById(CmsMaster, id, { ...data });
export const deleteCms = async (id: string, updatedBy: string) => await softDeleteById(CmsMaster, id, updatedBy);
export const changeCmsStatus = async (id: string, isActive: boolean, updatedBy: string) => await setActiveStatusById(CmsMaster, id, isActive, updatedBy);
export const changeCmsDisplayStatus = async (id: string, isDisplay: boolean, updatedBy: string) => await setDisplayStatusById(CmsMaster, id, isDisplay, updatedBy);
