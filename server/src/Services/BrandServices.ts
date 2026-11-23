import Brand, { IBrand } from "../Models/BrandMaster";
import { findActiveById, listDocuments, setActiveStatusById, softDeleteById, updateActiveById } from "../utils/crudService";

export const CreateBrand = async (data: Partial<IBrand>) => {
    const { brandLogo: _brandLogo, ...brandData } = data as Partial<IBrand> & { brandLogo?: string };
    const brand = new Brand(brandData);
    return await brand.save();
};

export const GetAllBrands = async (query?: any) => {
    return await listDocuments(Brand, query, { searchFields: ["brandName"] });
};

export const GetBrandById = async (id: string) => {
    return await findActiveById(Brand, id);
};

export const UpdateBrand = async (id: string, data: Partial<IBrand>) => {
    const { brandLogo: _brandLogo, ...brandData } = data as Partial<IBrand> & { brandLogo?: string };
    return await Brand.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { $set: { ...brandData }, $unset: { brandLogo: "" } },
        { new: true, runValidators: true }
    );
};

export const DeleteBrand = async (id: string, updatedBy: string) => {
    return await softDeleteById(Brand, id, updatedBy);
};

export const ChangeActiveStatus = async (id: string, isActive: boolean, updatedBy: string) => {
    return await setActiveStatusById(Brand, id, isActive, updatedBy);
};
