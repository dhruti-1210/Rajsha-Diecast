import api from './axios';
import type { Banner, BannerInput } from '../types/banner';

export interface BannerApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getBannerList = async () => {
  const response = await api.get<BannerApiResponse<Banner[]>>('/banners/list');
  return response.data;
};

export const getBannerById = async (id: string) => {
  const response = await api.get<BannerApiResponse<Banner>>(
    `/banners/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createBanner = async (banner: BannerInput) => {
  const response = await api.post<BannerApiResponse<Banner>>(
    '/banners/create',
    banner,
  );
  return response.data;
};

export const updateBanner = async (
  id: string,
  banner: Partial<BannerInput>,
) => {
  const response = await api.put<BannerApiResponse<Banner>>(
    `/banners/update/${encodeURIComponent(id)}`,
    banner,
  );
  return response.data;
};

export const deleteBanner = async (id: string, updatedBy: string) => {
  const response = await api.delete<BannerApiResponse<Banner>>(
    `/banners/delete/${encodeURIComponent(id)}`,
    { data: { updatedBy } },
  );
  return response.data;
};

export const changeBannerStatus = async (
  id: string,
  isActive: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<BannerApiResponse<Banner>>(
    `/banners/status/${encodeURIComponent(id)}`,
    { isActive, updatedBy },
  );
  return response.data;
};
