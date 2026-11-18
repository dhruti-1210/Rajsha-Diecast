import api from './axiosApi';
import type { Review, ReviewInput, ReviewsApiResponse } from '@/types/Reviews';

export const createReview = async (review: ReviewInput) => {
  const response = await api.post<ReviewsApiResponse<Review>>('/reviews/create', review);
  return response.data;
};

export const getMyReviews = async () => {
  const response = await api.get<ReviewsApiResponse<Review[]>>('/reviews/mine');
  return response.data;
};

export const getPublicReviews = async () => {
  const response = await api.get<ReviewsApiResponse<Review[]>>('/reviews/public');
  return response.data;
};