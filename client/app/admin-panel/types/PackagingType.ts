export interface PackagingType {
  _id: string;
  packagingName: string;
  Description: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  isDeleted?: boolean;
}

export interface PackagingTypeInput {
  packagingName: string;
  Description: string;
  createdBy: string;
  updatedBy: string;
  isActive?: boolean;
}
