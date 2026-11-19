import axios from 'axios';
import api from './axios';

interface Admin {
  id: string;
  email: string;
}

interface AdminAuthResponse {
  success: boolean;
  message: string;
  data: { admin: Admin };
}

export const loginAdmin = async (email: string, password: string) => {
  const response = await api.post<AdminAuthResponse>('/admin-users/login', {
    email,
    password,
  });
  return response.data;
};

export const getAdminSession = async () => {
  try {
    const response = await api.get<AdminAuthResponse>('/admin-users/session');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

export const logoutAdmin = async () => {
  const response = await api.post<{ success: boolean; message: string }>(
    '/admin-users/logout',
  );
  return response.data;
};
