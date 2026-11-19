import api from './axiosApi';
import type { Cart, CartApiResponse, CartInput } from '@/types/Cart';

export const createCart = async (cart: CartInput) => {
  const response = await api.post<CartApiResponse<Cart>>('/cart/create', cart);
  return response.data;
};

export const getCartList = async () => {
  const response = await api.get<CartApiResponse<Cart[]>>('/cart/list');
  return response.data;
};

export const deleteCart = async (id: string) => {
  const response = await api.delete<CartApiResponse<Cart>>(
    `/cart/delete/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const updateCartQuantity = async (id: string, Quantity: number) => {
  const response = await api.put<CartApiResponse<Cart>>(
    `/cart/update/${encodeURIComponent(id)}`,
    { Quantity },
  );
  return response.data;
};
