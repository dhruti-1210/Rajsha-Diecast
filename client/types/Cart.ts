import type { Product } from '@/types';
import type { Product as ProductRecord } from '@/types/Product';

export interface Cart {
  _id: string;
  User_Id: string;
  Product_Id: string | ProductRecord | null;
  Quantity: number;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}

export interface CartInput {
  Product_Id: string;
  Quantity: number;
}

export interface CartApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CartItem extends Product {
  key: string;
  cartId?: string;
  quantity: number;
  isSaving?: boolean;
  isRemoving?: boolean;
  isUpdating?: boolean;
}
