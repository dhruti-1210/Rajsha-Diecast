import api from './axios';
import type { ReviewMaster, ReviewMasterInput } from '../types/ReviewMaster';

export interface ReviewMasterApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getReviewMasterList = async () => {
  const response = await api.get<ReviewMasterApiResponse<ReviewMaster[]>>('/reviews/list');
  return response.data;
};

export const getReviewMasterById = async (id: string) => {
  const response = await api.get<ReviewMasterApiResponse<ReviewMaster>>(
    `/reviews/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createReviewMaster = async (review: ReviewMasterInput) => {
  const response = await api.post<ReviewMasterApiResponse<ReviewMaster>>(
    '/reviews/create',
    review,
  );
  return response.data;
};

export const updateReviewMaster = async (
  id: string,
  review: Partial<ReviewMasterInput>,
) => {
  const response = await api.put<ReviewMasterApiResponse<ReviewMaster>>(
    `/reviews/update/${encodeURIComponent(id)}`,
    review,
  );
  return response.data;
};

export const deleteReviewMaster = async (id: string, updatedBy: string) => {
  const response = await api.delete<ReviewMasterApiResponse<ReviewMaster>>(
    `/reviews/delete/${encodeURIComponent(id)}`,
    { data: { updatedBy } },
  );
  return response.data;
};

export const changeReviewMasterStatus = async (
  id: string,
  isActive: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<ReviewMasterApiResponse<ReviewMaster>>(
    `/reviews/status/${encodeURIComponent(id)}`,
    { isActive, updatedBy },
  );
  return response.data;
};

export const changeReviewMasterDisplayStatus = async (
  id: string,
  isDisplay: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<ReviewMasterApiResponse<ReviewMaster>>(
    `/reviews/display-status/${encodeURIComponent(id)}`,
    { isDisplay, updatedBy },
  );
  return response.data;
};
