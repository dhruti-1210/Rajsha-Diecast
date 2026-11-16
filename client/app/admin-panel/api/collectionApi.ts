
import api from './axios';
import type { CollectionType, CollectionTypeInput } from '../types/CollectionType';

export interface CollectionApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Get Collection Type List
export const getCollectionTypeList = async () => {
  const response = await api.get<CollectionApiResponse<CollectionType[]>>(
    '/collection-types/list',
  );
  return response.data;
};

// Get Collection Type By ID
export const getCollectionTypeById = async (id: string) => {
  const response = await api.get<CollectionApiResponse<CollectionType>>(
    `/collection-types/${encodeURIComponent(id)}`,
  );
  return response.data;
};

// Create Collection Type
export const createCollectionType = async (collection: CollectionTypeInput) => {
  const response = await api.post<CollectionApiResponse<CollectionType>>(
    '/collection-types/create',
    collection,
  );
  return response.data;
};

// Update Collection Type
export const updateCollectionType = async (
  id: string,
  collection: Partial<CollectionTypeInput>,
) => {
  const response = await api.put<CollectionApiResponse<CollectionType>>(
    `/collection-types/update/${encodeURIComponent(id)}`,
    collection,
  );
  return response.data;
};

// Delete Collection Type (Soft Delete)
export const deleteCollectionType = async (id: string) => {
  const response = await api.delete<CollectionApiResponse<CollectionType>>(
    `/collection-types/delete/${encodeURIComponent(id)}`,
  );
  return response.data;
};

// Change Active Status
export const changeCollectionTypeStatus = async (
  id: string,
  isActive: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<CollectionApiResponse<CollectionType>>(
    `/collection-types/status/${encodeURIComponent(id)}`,
    { isActive, updatedBy },
  );
  return response.data;
};

// Change Display Status
export const changeCollectionTypeDisplayStatus = async (
  id: string,
  isDisplay: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<CollectionApiResponse<CollectionType>>(
    `/collection-types/display-status/${encodeURIComponent(id)}`,
    { isDisplay, updatedBy },
  );
  return response.data;
};
