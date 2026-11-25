export interface UserMaster {
  _id: string;
  name: string;
  mobile: string;
  email: string;
  address: string;
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  isDisplay: boolean;
  isDeleted: boolean;
}
