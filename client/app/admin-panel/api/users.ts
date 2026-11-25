import api from './axios';
import type { UserMaster } from '../types/User';

export interface UserMasterApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getUserList = async () => {
  const response = await api.get<UserMasterApiResponse<UserMaster[]>>('/users/list');
  return response.data;
};

export const changeUserStatus = async (
  id: string,
  isActive: boolean,
  updatedBy: string,
) => {
  const response = await api.patch<UserMasterApiResponse<UserMaster>>(
    `/users/status/${encodeURIComponent(id)}`,
    { isActive, updatedBy },
  );
  return response.data;
};
