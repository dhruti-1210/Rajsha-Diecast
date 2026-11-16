export interface ProductMaster {
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
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  isDisplay: boolean;
  isDeleted: boolean;
}

export interface ProductMasterInput {
  Name: string;
  BrandName: string;
  Company_Id?: string;
  TotalStock?: number;
  Price: number;
  ModelCode: string;
  Size?: string;
  Description?: string;
  Packagingtype_Id: string;
  Image?: string[];
  CollectionName: string;
  Collectiontype_id?: string;
  createdBy: string;
  updatedBy: string;
  isActive?: boolean;
  isDisplay?: boolean;
  isDeleted?: boolean;
}