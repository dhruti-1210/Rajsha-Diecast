export interface Product {
  _id: string;
  Name: string;
  BrandName?: string;
  Company_Id?: string;
  TotalStock: number;
  Price: number;
  ModelCode: string;
  Size: string;
  Description: string;
  Packagingtype_Id: string;
  Image: string[];
  CollectionName?: string;
  Collectiontype_id?: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isActive: boolean;
  isDisplay: boolean;
  isDeleted: boolean;
}

export interface ProductReference {
  _id: string;
  isActive: boolean;
  isDeleted?: boolean;
}

export interface ProductPackagingType extends ProductReference {
  packagingName: string;
}

export interface ProductCollectionType extends ProductReference {
  collectionName: string;
  isDisplay?: boolean;
}

export interface ProductApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}