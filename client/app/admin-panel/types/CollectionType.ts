
export interface CollectionType {
  _id: string;
  collectionName: string;
  Description: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  isDisplay: boolean;
  isDeleted?: boolean;
}

export interface CollectionTypeInput {
  collectionName: string;
  Description: string;
  createdBy?: string;
  updatedBy?: string;
  isActive?: boolean;
  isDisplay?: boolean;
}
