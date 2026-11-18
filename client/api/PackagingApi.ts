import api from './axiosApi';
import type { ProductApiResponse } from '@/types/Product';
import type { PackagingType } from '@/types/PackagingType';

export const getPackagingTypeList = async () => {
  const response = await api.get<ProductApiResponse<PackagingType[]>>(
    '/packaging-types/list',
  );
  return response.data;
};