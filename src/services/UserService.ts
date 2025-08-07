import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/user';

export const register = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/register`, payload);
    return response.data;
  } catch (error) {
    console.error('register error:', error);
    throw error;
  }
};

export const login = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/login`, payload);
    return response.data;
  } catch (error) {
    console.error('login error:', error);
    throw error;
  }
};

export const refreshToken = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/refresh`, payload);
    return response.data;
  } catch (error) {
    console.error('refreshToken error:', error);
    throw error;
  }
};

export const modifyUser = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/modify`, payload);
    return response.data;
  } catch (error) {
    console.error('modifyUser error:', error);
    throw error;
  }
};

export const getProfile = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/info`);
    return response.data;
  } catch (error) {
    console.error('getProfile error:', error);
    throw error;
  }
};

export const getPurchaseRecord = async (
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/record/purchase`, payload);
    return response.data;
  } catch (error) {
    console.error('getPurchaseRecord error:', error);
    throw error;
  }
};

export const getOfferingRecord = async (
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/record/offering`, payload);
    return response.data;
  } catch (error) {
    console.error('getOfferingRecord error:', error);
    throw error;
  }
};

export const getMyGodInfo = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/record/my-god-info`);
    return response.data;
  } catch (error) {
    console.error('getMyGodInfo error:', error);
    throw error;
  }
};

export const sendResetPasswordMail = async (payload: {
  email: string;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/forget-password`, payload);
    return response.data;
  } catch (error) {
    console.error('sendResetPasswordMail error:', error);
    throw error;
  }
};

export const verifyResetToken = async (
  token: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get(`${basePath}/reset-password/verify`, {
      params: { token },
    });
    return response.data;
  } catch (error) {
    console.error('verifyResetToken error:', error);
    throw error;
  }
};

export const resetPassword = async (
  payload: any
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/reset-password`, payload);
    return response.data;
  } catch (error) {
    console.error('resetPassword error:', error);
    throw error;
  }
};

export const oauth2Login = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/oauth2/login`, payload);
    return response.data;
  } catch (error) {
    console.error('oauth2Login error:', error);
    throw error;
  }
};
