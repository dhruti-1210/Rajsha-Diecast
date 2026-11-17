export interface ScaleSize {
  _id: string;
  ScaleSize: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  isDeleted?: boolean;
}

export interface ScaleSizeInput {
  ScaleSize: string;
  createdBy: string;
  updatedBy: string;
  isActive?: boolean;
}