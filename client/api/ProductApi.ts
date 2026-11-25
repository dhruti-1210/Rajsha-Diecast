import api from './axiosApi';
import type {
  Product,
  ProductApiResponse,
  ProductCollectionType,
  ProductPackagingType,
} from '@/types/Product';

export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  brandId?: string[];
  packagingTypeId?: string[];
  minPrice?: number;
  maxPrice?: number;
  shop?: boolean;
}

export const getProductList = async (params?: ProductListParams) => {
  const response = await api.get<ProductApiResponse<Product[]>>('/products/list', {
    params: params
      ? {
          ...params,
          brandId: params.brandId?.length ? params.brandId.join(',') : undefined,
          packagingTypeId: params.packagingTypeId?.length ? params.packagingTypeId.join(',') : undefined,
        }
      : undefined,
  });
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