import api from './axios';
import type { ProductMaster, ProductMasterInput } from '../types/Product';

export interface ProductApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProductReference {
  _id: string;
  isActive: boolean;
  isDeleted?: boolean;
}

export interface BrandReference extends ProductReference {
  companyName: string;
}

export interface PackagingReference extends ProductReference {
  packagingName: string;
  Description: string;
}

export interface CollectionReference extends ProductReference {
  collectionName: string;
}

export const getProductMasterList = async () => {
  const response = await api.get<ProductApiResponse<ProductMaster[]>>(
    '/products/list',
  );
  return response.data;
};

export const getProductMasterById = async (id: string) => {
  const response = await api.get<ProductApiResponse<ProductMaster>>(
    `/products/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createProductMaster = async (product: ProductMasterInput) => {
  const response = await api.post<ProductApiResponse<ProductMaster>>(
    '/products/create',
    product,
  );
  return response.data;
};

export const updateProductMaster = async (
  id: string,
  product: ProductMasterInput,
) => {
  const response = await api.put<ProductApiResponse<ProductMaster>>(
    `/products/update/${encodeURIComponent(id)}`,
    product,
  );
  return response.data;
};

export const deleteProductMaster = async (id: string) => {
  const response = await api.delete<ProductApiResponse<ProductMaster>>(
    `/products/delete/${encodeURIComponent(id)}`,
    { data: { updatedBy: 'admin' } },
  );
  return response.data;
};

export const getProductMasterReferences = async () => {
  const [brands, packagingTypes, collectionTypes] = await Promise.all([
    api.get<ProductApiResponse<BrandReference[]>>('/brands/list'),
    api.get<ProductApiResponse<PackagingReference[]>>('/packaging-types/list'),
    api.get<ProductApiResponse<CollectionReference[]>>('/collection-types/list'),
  ]);

  return {
    brands: brands.data.data.filter((item) => item.isActive && !item.isDeleted),
    packagingTypes: packagingTypes.data.data.filter(
      (item) => item.isActive && !item.isDeleted,
    ),
    collectionTypes: collectionTypes.data.data.filter(
      (item) => item.isActive && !item.isDeleted,
    ),
  };
};

