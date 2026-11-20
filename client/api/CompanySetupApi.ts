import api from './axiosApi';
import type { CompanySetup } from '@/types/CompanySetup';

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
