import PackagingType, { IPackagingType } from "../Models/PackagingTypeMaster";
import { findActiveById, listDocuments, setActiveStatusById, softDeleteById, updateActiveById } from "../utils/crudService";

function normalizePackagingData(data: Partial<IPackagingType> | any) {
  const next = { ...data };
  if (next.packagingName === undefined && next.packaginName !== undefined) next.packagingName = next.packaginName;
  if (next.packagingName !== undefined) next.packaginName = next.packagingName;
  if (typeof next.packagingName === "string") next.packagingName = next.packagingName.trim();
  if (typeof next.packaginName === "string") next.packaginName = next.packaginName.trim();
  if (typeof next.Description === "string") next.Description = next.Description.trim();
  return next;
}

export const createPackagingType = async (data: Partial<IPackagingType>) => await new PackagingType(normalizePackagingData(data)).save();
export const getAllPackagingTypes = async (query?: any) => await listDocuments(PackagingType, query, { searchFields: ["packagingName", "packaginName", "Description"] });
export const getPackagingTypeById = async (id: string) => await findActiveById(PackagingType, id);
export const updatePackagingType = async (id: string, data: Partial<IPackagingType>) => await updateActiveById(PackagingType, id, normalizePackagingData(data));
export const deletePackagingType = async (id: string, updatedBy: string) => await softDeleteById(PackagingType, id, updatedBy);
export const changePackagingTypeStatus = async (id: string, isActive: boolean, updatedBy: string) => await setActiveStatusById(PackagingType, id, isActive, updatedBy);
