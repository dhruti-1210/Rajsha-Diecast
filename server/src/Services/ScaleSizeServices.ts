import ScaleSize, { IScaleSize } from "../Models/ScaleSize";
import { findActiveById, listDocuments, setActiveStatusById, softDeleteById, updateActiveById } from "../utils/crudService";

export const CreateScaleSize = async (data: Partial<IScaleSize>) => {
    return await ScaleSize.create(data);
};

export const GetAllScaleSize = async (query?: any) => {
    return await listDocuments(ScaleSize, query, { searchFields: ["ScaleSize"] });
};

export const GetScaleSizeById = async (id: string) => {
    return await findActiveById(ScaleSize, id);
};

export const UpdateScaleSize = async (id: string, data: Partial<IScaleSize>) => {
    return await updateActiveById(ScaleSize, id, { ...data });
};

export const DeleteScaleSize = async (id: string, updatedBy: string) => {
    return await softDeleteById(ScaleSize, id, updatedBy);
};

export const ChangeScaleSizeActiveStatus = async (id: string, isActive: boolean, updatedBy: string) => {
    return await setActiveStatusById(ScaleSize, id, isActive, updatedBy);
};
