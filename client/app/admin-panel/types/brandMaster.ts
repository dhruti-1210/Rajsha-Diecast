export interface BrandMaster {
  _id: string;
  brandName: string;
  brandLogo: string;
  modelCount: number;
  scaleSize: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface BrandMasterInput {
  brandName: string;
  brandLogo: string;
  modelCount: number;
  scaleSize: number;
  createdBy?: string;
  updatedBy: string;
  isActive?: boolean;
}
