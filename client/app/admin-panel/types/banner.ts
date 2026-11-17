export interface Banner {
  _id: string;
  BannerImg: string;
  BannerTitle: string;
  BannerSubTitle: string;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface BannerInput {
  BannerImg: string;
  BannerTitle: string;
  BannerSubTitle: string;
  createdBy: string;
  updatedBy: string;
  isActive?: boolean;
}
