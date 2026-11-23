import api from './axios';
import type { ApiResponse, ListParams } from './types';
import type { FooterLinkGroup, FooterLinkGroupInput } from '../types/FooterLinkGroup';

export type { ApiResponse };

export const getFooterLinkGroupList = async (params?: ListParams) => {
  const response = await api.get<ApiResponse<FooterLinkGroup[]>>(
    '/footer-link-groups/list',
    { params },
  );
  return response.data;
};

export const getFooterLinkGroupById = async (id: string) => {
  const response = await api.get<ApiResponse<FooterLinkGroup>>(
    `/footer-link-groups/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createFooterLinkGroup = async (group: FooterLinkGroupInput) => {
  const response = await api.post<ApiResponse<FooterLinkGroup>>(
    '/footer-link-groups/create',
    group,
  );
  return response.data;
};

export const updateFooterLinkGroup = async (
  id: string,
  group: Partial<FooterLinkGroupInput>,
) => {
  const response = await api.put<ApiResponse<FooterLinkGroup>>(
    `/footer-link-groups/update/${encodeURIComponent(id)}`,
    group,
  );
  return response.data;
};

export const deleteFooterLinkGroup = async (id: string) => {
  const response = await api.delete<ApiResponse<FooterLinkGroup>>(
    `/footer-link-groups/delete/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const changeFooterLinkGroupStatus = async (
  id: string,
  isActive: boolean,
) => {
  const response = await api.patch<ApiResponse<FooterLinkGroup>>(
    `/footer-link-groups/status/${encodeURIComponent(id)}`,
    { isActive },
  );
  return response.data;
};

export const changeFooterLinkGroupDisplayStatus = async (
  id: string,
  isDisplay: boolean,
) => {
  const response = await api.patch<ApiResponse<FooterLinkGroup>>(
    `/footer-link-groups/display-status/${encodeURIComponent(id)}`,
    { isDisplay },
  );
  return response.data;
};
