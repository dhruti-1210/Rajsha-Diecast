import api from './axios';
import type { Cms, CmsInput } from '../types/cms';
import type { ApiResponse, ListParams } from './types';

export type CmsApiResponse<T> = ApiResponse<T>;

export const getCmsList = async (params: ListParams = {}) => {
  const response = await api.get<CmsApiResponse<Cms[]>>('/cms/list', { params });
  return response.data;
};

export const getCmsById = async (id: string) => {
  const response = await api.get<CmsApiResponse<Cms>>(`/cms/${encodeURIComponent(id)}`);
  return response.data;
};

export const createCms = async (cms: CmsInput) => {
  const response = await api.post<CmsApiResponse<Cms>>('/cms/create', cms);
  return response.data;
};

export const updateCms = async (id: string, cms: Partial<CmsInput>) => {
  const response = await api.put<CmsApiResponse<Cms>>(`/cms/update/${encodeURIComponent(id)}`, cms);
  return response.data;
};

export const deleteCms = async (id: string, updatedBy?: string) => {
  const response = await api.delete<CmsApiResponse<Cms>>(`/cms/delete/${encodeURIComponent(id)}`, { data: updatedBy ? { updatedBy } : {} });
  return response.data;
};

export const changeCmsStatus = async (id: string, isActive: boolean, updatedBy?: string) => {
  const response = await api.patch<CmsApiResponse<Cms>>(`/cms/status/${encodeURIComponent(id)}`, { isActive, ...(updatedBy ? { updatedBy } : {}) });
  return response.data;
};

export const changeCmsDisplayStatus = async (id: string, isDisplay: boolean, updatedBy?: string) => {
  const response = await api.patch<CmsApiResponse<Cms>>(`/cms/display-status/${encodeURIComponent(id)}`, { isDisplay, ...(updatedBy ? { updatedBy } : {}) });
  return response.data;
};
