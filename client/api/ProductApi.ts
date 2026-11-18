import api from './axiosApi';
import type {
  Product,
  ProductApiResponse,
  ProductCollectionType,
  ProductPackagingType,
} from '@/types/Product';

export const getProductList = async () => {
  const response = await api.get<ProductApiResponse<Product[]>>('/products/list');
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await api.get<ProductApiResponse<Product>>(
    `/products/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const getProductPackagingTypes = async () => {
  const response = await api.get<ProductApiResponse<ProductPackagingType[]>>(
    '/packaging-types/list',
  );
  return response.data;
};

export const getProductCollectionTypes = async () => {
  const response = await api.get<ProductApiResponse<ProductCollectionType[]>>(
    '/collection-types/list',
  );
  return response.data;
};