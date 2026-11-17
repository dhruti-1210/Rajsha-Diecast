import api from './axios';
import type { PackagingType, PackagingTypeInput } from '../types/PackagingType';

export interface PackagingTypeApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getPackagingTypeList = async () => {
  const response = await api.get<PackagingTypeApiResponse<PackagingType[]>>(
    '/packaging-types/list',
  );
  return response.data;
};

export const getPackagingTypeById = async (id: string) => {
  const response = await api.get<PackagingTypeApiResponse<PackagingType>>(
    `/packaging-types/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createPackagingType = async (packagingType: PackagingTypeInput) => {
  const response = await api.post<PackagingTypeApiResponse<PackagingType>>(
    '/packaging-types/create',
    packagingType,
  );
  return response.data;
};

export const updatePackagingType = async (
  id: string,
  packagingType: Partial<PackagingTypeInput>,
) => {
  const response = await api.put<PackagingTypeApiResponse<PackagingType>>(
    `/packaging-types/update/${encodeURIComponent(id)}`,
    packagingType,
  );
  return response.data;
};

export const deletePackagingType = async (id: string, updatedBy: string) => {
  const response = await api.delete<PackagingTypeApiResponse<PackagingType>>(
    `/packaging-types/delete/${encodeURIComponent(id)}`,
    { data: { updatedBy } },
  );
  return response.data;
};

export const changePackagingTypeStatus = async (
  id: string,
  isActive: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<PackagingTypeApiResponse<PackagingType>>(
    `/packaging-types/status/${encodeURIComponent(id)}`,
    { isActive, updatedBy },
  );
  return response.data;
};
