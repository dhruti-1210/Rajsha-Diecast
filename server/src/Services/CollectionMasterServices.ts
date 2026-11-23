import CollectionType, { ICollectionType } from "../Models/CollectionTypeMaster";
import { findActiveById, listDocuments, setActiveStatusById, setDisplayStatusById, softDeleteById, updateActiveById } from "../utils/crudService";

export const createCollectionType = async (data: Partial<ICollectionType>) => await new CollectionType(data).save();
export const getAllCollectionTypes = async (query?: any) => await listDocuments(CollectionType, query, { searchFields: ["collectionName", "collectionDescription"] });
export const getCollectionTypeById = async (id: string) => await findActiveById(CollectionType, id);
export const updateCollectionType = async (id: string, data: Partial<ICollectionType>) => await updateActiveById(CollectionType, id, { ...data });
export const deleteCollectionType = async (id: string, updatedBy = "admin") => await softDeleteById(CollectionType, id, updatedBy);
export const changeCollectionTypeStatus = async (id: string, isActive: boolean, updatedBy: string) => await setActiveStatusById(CollectionType, id, isActive, updatedBy);
export const changeCollectionTypeDisplayStatus = async (id: string, isDisplay: boolean, updatedBy: string) => await setDisplayStatusById(CollectionType, id, isDisplay, updatedBy);
