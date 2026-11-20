import api from './axiosApi';
import type { OrderMaster, OrderMasterApiResponse } from '@/types/orderMaster';

export const getMyOrders = async () => {
  const response = await api.get<OrderMasterApiResponse<OrderMaster[]>>('/orders/my');
  return response.data;
};

export const placeOrder = async () => {
  const response = await api.post<OrderMasterApiResponse<OrderMaster>>('/orders/place');
  return response.data;
};

export const MY_ORDERS_UPDATED_EVENT = 'rajsha:orders-updated';
