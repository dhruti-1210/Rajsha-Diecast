export interface Cms {
  _id: string;
  Name: string;
  Description: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  isDisplay: boolean;
  isDeleted: boolean;
}

export interface CmsInput {
  Name: string;
  Description: string;
  createdBy?: string;
  updatedBy: string;
  isActive: boolean;
  isDisplay: boolean;
}
