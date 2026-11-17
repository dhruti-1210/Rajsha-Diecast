export interface FooterLinkGroup {
  _id: string;
  FooterLinkGroupName: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
  isDisplay: boolean;
  isDeleted: boolean;
}

export interface FooterLinkGroupInput {
  FooterLinkGroupName: string;
  createdBy?: string;
  updatedBy: string;
  isActive?: boolean;
  isDisplay?: boolean;
}
