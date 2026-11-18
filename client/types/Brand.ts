export interface Brand {
  _id: string;
  brandName: string;
  modelCount: number;
  scaleSize: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface BrandInput {
  brandName: string;
  modelCount: number;
  scaleSize: number;
  createdBy?: string;
  updatedBy: string;
  isActive?: boolean;
}