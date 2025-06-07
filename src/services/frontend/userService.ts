import { api } from './FrontendAPI';

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
  imageUri: string
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: `profile_${userId}.jpg`,
      type: 'image/jpeg',
    } as any); // 若你使用的是 React Native, 這裡需加 `as any`

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
