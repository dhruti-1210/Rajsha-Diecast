import api from './axios';
import type { CompanySetup, CompanySetupInput } from '../types/companySetup';

export interface CompanySetupApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getCompanySetupList = async () => {
  const response = await api.get<CompanySetupApiResponse<CompanySetup[]>>(
    '/company-setup/list',
  );
  return response.data;
};

export const getCompanySetupById = async (id: string) => {
  const response = await api.get<CompanySetupApiResponse<CompanySetup>>(
    `/company-setup/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createCompanySetup = async (companySetup: CompanySetupInput) => {
  const response = await api.post<CompanySetupApiResponse<CompanySetup>>(
    '/company-setup/create',
    companySetup,
  );
  return response.data;
};

export const updateCompanySetup = async (
  id: string,
  companySetup: Partial<CompanySetupInput>,
) => {
  const response = await api.patch<CompanySetupApiResponse<CompanySetup>>(
    `/company-setup/update/${encodeURIComponent(id)}`,
    companySetup,
  );
  return response.data;
};

export const deleteCompanySetup = async (id: string) => {
  const response = await api.delete<CompanySetupApiResponse<CompanySetup>>(
    `/company-setup/delete/${encodeURIComponent(id)}`,
  );
  return response.data;
};
