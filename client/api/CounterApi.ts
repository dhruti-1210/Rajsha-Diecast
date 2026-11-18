import api from './axiosApi';
import type { ProductApiResponse } from '@/types/Product';
import type { Counter } from '@/types/Counter';

export const getCounterList = async () => {
  const response = await api.get<ProductApiResponse<Counter[]>>('/counters/list');
  return response.data;
};
