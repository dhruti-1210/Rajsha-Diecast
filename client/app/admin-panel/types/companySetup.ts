export interface CompanySetup {
  _id: string;
  CompanyName: string;
  companyLogo: string;
  ShippingCharges: number;
  FreeShippingCharge: number;
  OnlyNLeft: number;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  isDisplay: boolean;
  isDeleted?: boolean;
}

export interface CompanySetupInput {
  CompanyName: string;
  companyLogo: string;
  ShippingCharges: number;
  FreeShippingCharge: number;
  OnlyNLeft: number;
  createdBy: string;
  updatedBy: string;
  isActive?: boolean;
  isDisplay?: boolean;
}