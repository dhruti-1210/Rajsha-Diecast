import api from './axios';
import type { ScaleSize, ScaleSizeInput } from '../types/ScaleSize';
import type { ApiResponse, ListParams } from './types';

export type ScaleSizeApiResponse<T> = ApiResponse<T>;

export const getScaleSizeList = async (params: ListParams = {}) => {
  const response = await api.get<ScaleSizeApiResponse<ScaleSize[]>>('/scale-sizes/list', { params });
  return response.data;
};

export const getScaleSizeById = async (id: string) => {
  const response = await api.get<ScaleSizeApiResponse<ScaleSize>>(`/scale-sizes/${encodeURIComponent(id)}`);
  return response.data;
};

export const createScaleSize = async (scaleSize: ScaleSizeInput) => {
  const response = await api.post<ScaleSizeApiResponse<ScaleSize>>('/scale-sizes/create', scaleSize);
  return response.data;
};

export const updateScaleSize = async (id: string, scaleSize: Partial<ScaleSizeInput>) => {
  const response = await api.put<ScaleSizeApiResponse<ScaleSize>>(`/scale-sizes/update/${encodeURIComponent(id)}`, scaleSize);
  return response.data;
};

export const deleteScaleSize = async (id: string, updatedBy?: string) => {
  const response = await api.delete<ScaleSizeApiResponse<ScaleSize>>(`/scale-sizes/delete/${encodeURIComponent(id)}`, { data: updatedBy ? { updatedBy } : {} });
  return response.data;
};

export const changeScaleSizeStatus = async (id: string, isActive: boolean, updatedBy?: string) => {
  const response = await api.patch<ScaleSizeApiResponse<ScaleSize>>(`/scale-sizes/status/${encodeURIComponent(id)}`, { isActive, ...(updatedBy ? { updatedBy } : {}) });
  return response.data;
};
