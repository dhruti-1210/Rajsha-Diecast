import api from './axios';
import type { CollectionType, CollectionTypeInput } from '../types/CollectionType';
import type { ApiResponse, ListParams } from './types';

export type CollectionApiResponse<T> = ApiResponse<T>;

export const getCollectionTypeList = async (params: ListParams = {}) => {
  const response = await api.get<CollectionApiResponse<CollectionType[]>>('/collection-types/list', { params });
  return response.data;
};

export const getCollectionTypeById = async (id: string) => {
  const response = await api.get<CollectionApiResponse<CollectionType>>(`/collection-types/${encodeURIComponent(id)}`);
  return response.data;
};

export const createCollectionType = async (collection: CollectionTypeInput) => {
  const response = await api.post<CollectionApiResponse<CollectionType>>('/collection-types/create', collection);
  return response.data;
};

export const updateCollectionType = async (id: string, collection: Partial<CollectionTypeInput>) => {
  const response = await api.put<CollectionApiResponse<CollectionType>>(`/collection-types/update/${encodeURIComponent(id)}`, collection);
  return response.data;
};

export const deleteCollectionType = async (id: string, updatedBy?: string) => {
  const response = await api.delete<CollectionApiResponse<CollectionType>>(`/collection-types/delete/${encodeURIComponent(id)}`, { data: updatedBy ? { updatedBy } : {} });
  return response.data;
};

export const changeCollectionTypeStatus = async (id: string, isActive: boolean, updatedBy?: string) => {
  const response = await api.patch<CollectionApiResponse<CollectionType>>(`/collection-types/status/${encodeURIComponent(id)}`, { isActive, ...(updatedBy ? { updatedBy } : {}) });
  return response.data;
};

export const changeCollectionTypeDisplayStatus = async (id: string, isDisplay: boolean, updatedBy?: string) => {
  const response = await api.patch<CollectionApiResponse<CollectionType>>(`/collection-types/display-status/${encodeURIComponent(id)}`, { isDisplay, ...(updatedBy ? { updatedBy } : {}) });
  return response.data;
};
