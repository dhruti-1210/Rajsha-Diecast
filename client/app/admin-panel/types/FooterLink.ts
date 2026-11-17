export interface FooterLinkGroupSummary {
  _id: string;
  FooterLinkGroupName: string;
}

export interface FooterLink {
  _id: string;
  FooterLinkGroupId: string | FooterLinkGroupSummary;
  FooterLinkName: string;
  FooterLinkUrl: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isActive: boolean;
  isDisplay: boolean;
  isDeleted: boolean;
}

export interface FooterLinkInput {
  FooterLinkGroupId: string;
  FooterLinkName: string;
  FooterLinkUrl: string;
  createdBy?: string;
  updatedBy?: string;
  isActive?: boolean;
  isDisplay?: boolean;
}
