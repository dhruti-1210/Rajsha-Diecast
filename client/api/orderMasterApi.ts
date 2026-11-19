import api from './axiosApi';
import type { OrderMaster, OrderMasterApiResponse } from '@/types/orderMaster';

export const getMyOrders = async () => {
  const response = await api.get<OrderMasterApiResponse<OrderMaster[]>>('/orders/my');
  return response.data;
};
