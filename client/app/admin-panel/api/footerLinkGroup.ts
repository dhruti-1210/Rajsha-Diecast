import api from './axios';
import type { FooterLinkGroup, FooterLinkGroupInput } from '../types/FooterLinkGroup';

export interface FooterLinkGroupApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getFooterLinkGroupList = async () => {
  const response = await api.get<FooterLinkGroupApiResponse<FooterLinkGroup[]>>(
    '/footer-link-groups/list',
  );
  return response.data;
};

export const getFooterLinkGroupById = async (id: string) => {
  const response = await api.get<FooterLinkGroupApiResponse<FooterLinkGroup>>(
    `/footer-link-groups/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createFooterLinkGroup = async (group: FooterLinkGroupInput) => {
  const response = await api.post<FooterLinkGroupApiResponse<FooterLinkGroup>>(
    '/footer-link-groups/create',
    group,
  );
  return response.data;
};

export const updateFooterLinkGroup = async (
  id: string,
  group: Partial<FooterLinkGroupInput>,
) => {
  const response = await api.put<FooterLinkGroupApiResponse<FooterLinkGroup>>(
    `/footer-link-groups/update/${encodeURIComponent(id)}`,
    group,
  );
  return response.data;
};

export const deleteFooterLinkGroup = async (id: string, updatedBy: string) => {
  const response = await api.delete<FooterLinkGroupApiResponse<FooterLinkGroup>>(
    `/footer-link-groups/delete/${encodeURIComponent(id)}`,
    { data: { updatedBy } },
  );
  return response.data;
};

export const changeFooterLinkGroupStatus = async (
  id: string,
  isActive: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<FooterLinkGroupApiResponse<FooterLinkGroup>>(
    `/footer-link-groups/status/${encodeURIComponent(id)}`,
    { isActive, updatedBy },
  );
  return response.data;
};
