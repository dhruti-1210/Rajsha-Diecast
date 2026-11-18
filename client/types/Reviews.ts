export interface Review {
  _id: string;
  user_id: string;
  name: string;
  message: string;
  createdAt?: string;
  isActive: boolean;
  isDisplay: boolean;
  isDeleted: boolean;
}

export interface ReviewInput {
  message: string;
}

export interface ReviewsApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}