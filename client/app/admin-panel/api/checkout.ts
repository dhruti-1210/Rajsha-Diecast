import api from './axios';
import type { Checkout, CheckoutStage } from '../types/checkout';

export interface CheckoutApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getCheckoutList = async () => {
  const response = await api.get<CheckoutApiResponse<Checkout[]>>('/checkout/list');
  return response.data;
};

export const getCheckoutById = async (id: string) => {
  const response = await api.get<CheckoutApiResponse<Checkout>>(
    `/checkout/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const updateCheckoutStatus = async (
  id: string,
  status: CheckoutStage,
  updatedBy: string,
) => {
  const response = await api.patch<CheckoutApiResponse<Checkout>>(
    `/checkout/status/${encodeURIComponent(id)}`,
    { status, updatedBy },
  );
  return response.data;
};
