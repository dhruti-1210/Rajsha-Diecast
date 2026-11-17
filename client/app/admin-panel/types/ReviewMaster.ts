export interface ReviewMaster {
  _id: string;
  user_id: string;
  message: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  isDisplay: boolean;
  isDeleted: boolean;
}

export interface ReviewMasterInput {
  user_id: string;
  message: string;
  name: string;
  createdBy?: string;
  updatedBy: string;
  isActive?: boolean;
  isDisplay?: boolean;
}
