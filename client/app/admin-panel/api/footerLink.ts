import api from './axios';
import type { ApiResponse, ListParams } from './types';
import type { FooterLink, FooterLinkInput } from '../types/FooterLink';

export type { ApiResponse };

export const getFooterLinkList = async (params?: ListParams & { FooterLinkGroupId?: string }) => {
  const response = await api.get<ApiResponse<FooterLink[]>>(
    '/footer-links/list',
    { params },
  );
  return response.data;
};

export const getFooterLinkById = async (id: string) => {
  const response = await api.get<ApiResponse<FooterLink>>(
    `/footer-links/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createFooterLink = async (link: FooterLinkInput) => {
  const response = await api.post<ApiResponse<FooterLink>>(
    '/footer-links/create',
    link,
  );
  return response.data;
};

export const updateFooterLink = async (
  id: string,
  link: Partial<FooterLinkInput>,
) => {
  const response = await api.put<ApiResponse<FooterLink>>(
    `/footer-links/update/${encodeURIComponent(id)}`,
    link,
  );
  return response.data;
};

export const deleteFooterLink = async (id: string) => {
  const response = await api.delete<ApiResponse<FooterLink>>(
    `/footer-links/delete/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const changeFooterLinkStatus = async (
  id: string,
  isActive: boolean,
) => {
  const response = await api.patch<ApiResponse<FooterLink>>(
    `/footer-links/status/${encodeURIComponent(id)}`,
    { isActive },
  );
  return response.data;
};

export const changeFooterLinkDisplayStatus = async (
  id: string,
  isDisplay: boolean,
) => {
  const response = await api.patch<ApiResponse<FooterLink>>(
    `/footer-links/display-status/${encodeURIComponent(id)}`,
    { isDisplay },
  );
  return response.data;
};
