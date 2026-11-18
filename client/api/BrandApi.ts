import api from './axiosApi';
import type { Brand, BrandInput } from '@/types/Brand';

export interface BrandApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getBrandList = async () => {
  const response = await api.get<BrandApiResponse<Brand[]>>('/brands/list');
  return response.data;
};

export const getBrandById = async (id: string) => {
  const response = await api.get<BrandApiResponse<Brand>>(
    `/brands/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createBrand = async (brand: BrandInput) => {
  const response = await api.post<BrandApiResponse<Brand>>(
    '/brands/create',
    brand,
  );
  return response.data;
};

export const updateBrand = async (
  id: string,
  brand: Partial<BrandInput>,
) => {
  const response = await api.put<BrandApiResponse<Brand>>(
    `/brands/update/${encodeURIComponent(id)}`,
    brand,
  );
  return response.data;
};

export const deleteBrand = async (id: string, updatedBy: string) => {
  const response = await api.delete<BrandApiResponse<Brand>>(
    `/brands/delete/${encodeURIComponent(id)}`,
    { data: { updatedBy } },
  );
  return response.data;
};

export const changeBrandStatus = async (
  id: string,
  isActive: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<BrandApiResponse<Brand>>(
    `/brands/status/${encodeURIComponent(id)}`,
    { isActive, updatedBy },
  );
  return response.data;
};
