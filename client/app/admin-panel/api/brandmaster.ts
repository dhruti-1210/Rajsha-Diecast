import api from './axios';
import type { BrandMaster, BrandMasterInput } from '../types/brandMaster';

export interface BrandMasterApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getBrandMasterList = async () => {
  const response = await api.get<BrandMasterApiResponse<BrandMaster[]>>('/brands/list');
  return response.data;
};

export const getBrandMasterById = async (id: string) => {
  const response = await api.get<BrandMasterApiResponse<BrandMaster>>(
    `/brands/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createBrandMaster = async (brand: BrandMasterInput) => {
  const response = await api.post<BrandMasterApiResponse<BrandMaster>>(
    '/brands/create',
    brand,
  );
  return response.data;
};

export const updateBrandMaster = async (
  id: string,
  brand: Partial<BrandMasterInput>,
) => {
  const response = await api.put<BrandMasterApiResponse<BrandMaster>>(
    `/brands/update/${encodeURIComponent(id)}`,
    brand,
  );
  return response.data;
};

export const deleteBrandMaster = async (id: string, updatedBy: string) => {
  const response = await api.delete<BrandMasterApiResponse<BrandMaster>>(
    `/brands/delete/${encodeURIComponent(id)}`,
    { data: { updatedBy } },
  );
  return response.data;
};

export const changeBrandMasterStatus = async (
  id: string,
  isActive: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<BrandMasterApiResponse<BrandMaster>>(
    `/brands/status/${encodeURIComponent(id)}`,
    { isActive, updatedBy },
  );
  return response.data;
};
