import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/user';

export interface User {
  [key: string]: any;
}

export const getUserInfo = async (): Promise<ApiResponse<User>> => {
  try {
    const response = await api.get<ApiResponse<User>>(
      `${basePath}/getUserInfo`
    );
    return response.data;
  } catch (error) {
    console.error('[User API] Error fetching user info:', error);
    throw error;
  }
};

export const registerUser = async (
  userReq: any
): Promise<ApiResponse<User>> => {
  try {
    const response = await api.post<ApiResponse<User>>(
      `${basePath}/register`,
      userReq
    );
    return response.data;
  } catch (error) {
    console.error('[User API] Error registering user:', error);
    throw error;
  }
};

export const updateUser = async (
  userReq: Partial<User>
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.put<ApiResponse<any>>(
      `${basePath}/updateUser`,
      userReq
    );
    return response.data;
  } catch (error) {
    console.error('[User API] Error updating user:', error);
    throw error;
  }
};

export const resetPassword = async (userReq: {
  oldPassword: string;
  newPassword: string;
}): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.put<ApiResponse<boolean>>(
      `${basePath}/resetPwd`,
      userReq
    );
    return response.data;
  } catch (error) {
    console.error('[User API] Error resetting password:', error);
    throw error;
  }
};

export const uploadProfileImage = async (
  userId: string,
  base64DataUrl: string
): Promise<boolean> => {
  try {
    // 將 base64 轉為 Blob
    const blob = await (await fetch(base64DataUrl)).blob();
    const file = new File([blob], `profile_${userId}.jpg`, {
      type: 'image/jpeg',
    });

    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post(
      `${basePath}/${userId}/upload-profile-image`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.status === 200;
  } catch (error) {
    console.error('[User API] Error uploading profile image:', error);
    return false;
  }
};
