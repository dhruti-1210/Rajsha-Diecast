import api from './axios';
import type { FooterLink, FooterLinkInput } from '../types/FooterLink';

export interface FooterLinkApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getFooterLinkList = async () => {
  const response = await api.get<FooterLinkApiResponse<FooterLink[]>>(
    '/footer-links/list',
  );
  return response.data;
};

export const getFooterLinkById = async (id: string) => {
  const response = await api.get<FooterLinkApiResponse<FooterLink>>(
    `/footer-links/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createFooterLink = async (link: FooterLinkInput) => {
  const response = await api.post<FooterLinkApiResponse<FooterLink>>(
    '/footer-links/create',
    link,
  );
  return response.data;
};

export const updateFooterLink = async (
  id: string,
  link: Partial<FooterLinkInput>,
) => {
  const response = await api.put<FooterLinkApiResponse<FooterLink>>(
    `/footer-links/update/${encodeURIComponent(id)}`,
    link,
  );
  return response.data;
};

export const deleteFooterLink = async (id: string) => {
  const response = await api.delete<FooterLinkApiResponse<FooterLink>>(
    `/footer-links/delete/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const changeFooterLinkStatus = async (
  id: string,
  isActive: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<FooterLinkApiResponse<FooterLink>>(
    `/footer-links/status/${encodeURIComponent(id)}`,
    { isActive, updatedBy },
  );
  return response.data;
};

export const changeFooterLinkDisplayStatus = async (
  id: string,
  isDisplay: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<FooterLinkApiResponse<FooterLink>>(
    `/footer-links/display-status/${encodeURIComponent(id)}`,
    { isDisplay, updatedBy },
  );
  return response.data;
};
