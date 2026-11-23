import Banner, { IBanner } from "../Models/BannerMaster";
import { findActiveById, listDocuments, setActiveStatusById, softDeleteById, updateActiveById } from "../utils/crudService";

export const createBanner = async (data: Partial<IBanner>) => await new Banner(data).save();
export const getAllBanners = async (query?: any) => await listDocuments(Banner, query, { searchFields: ["BannerTitle", "BannerSubTitle"] });
export const getBannerById = async (id: string) => await findActiveById(Banner, id);
export const updateBanner = async (id: string, data: Partial<IBanner>) => await updateActiveById(Banner, id, { ...data });
export const deleteBanner = async (id: string, updatedBy: string) => await softDeleteById(Banner, id, updatedBy);
export const changeBannerStatus = async (id: string, isActive: boolean, updatedBy: string) => await setActiveStatusById(Banner, id, isActive, updatedBy);
