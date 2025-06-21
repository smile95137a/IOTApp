import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/user`;

/**
 * 用戶接口 (User Interface)
 */
export interface User {
  [key: string]: any;
}

/**
 * 取得當前用戶資訊
 */
export const fetchUserInfo = async (): Promise<ApiResponse<User>> => {
  const url = `${API_BASE_URL}${basePath}/getUserInfo`;
  console.log(`[User API] Fetching user info from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[User API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[User API] Error fetching user info:`, error);
    throw error;
  }
};

/**
 * 註冊新用戶
 * @param userReq 用戶註冊資料
 */
export const registerUser = async (
  userReq: any
): Promise<ApiResponse<User>> => {
  const url = `${API_BASE_URL}${basePath}/register`;
  console.log(`[User API] Registering user at ${url} with data:`, userReq);

  try {
    const response = await api.post(url, userReq);
    console.log(`[User API] Registration Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[User API] Error registering user:`, error);
    throw error;
  }
};

/**
 * 更新用戶資料 (只能更新自己)
 * @param userReq 更新資料
 */
export const updateUser = async (
  userReq: Partial<User>
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/updateUser`;
  console.log(`[User API] Updating user at ${url} with data:`, userReq);

  try {
    const response = await api.put(url, userReq);
    console.log(`[User API] Update Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[User API] Error updating user:`, error);
    throw error;
  }
};

/**
 * 重設密碼
 * @param userReq 密碼重設請求
 */
export const resetPassword = async (userReq: {
  oldPassword: string;
  newPassword: string;
}): Promise<ApiResponse<boolean>> => {
  const url = `${API_BASE_URL}${basePath}/resetPwd`;
  console.log(`[User API] Resetting password at ${url} with data:`, userReq);

  try {
    const response = await api.put(url, userReq);
    console.log(`[User API] Reset Password Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[User API] Error resetting password:`, error);
    throw error;
  }
};

/**
 * 上傳用戶頭像
 * @param userId 用戶 ID
 * @param imageUri 本地圖片 URI
 */
export const uploadProfileImage = async (
  userId: string,
  imageUri: string
): Promise<boolean> => {
  const url = `${API_BASE_URL}${basePath}/${userId}/upload-profile-image`;
  console.log(
    `[User API] Uploading profile image for user: ${userId} to ${url}`
  );

  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: `profile_${userId}.jpg`,
      type: 'image/jpeg',
    });

    console.log(`[User API] FormData:`, formData);

    const response = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log(`[User API] Profile Image Upload Success:`, response.data);
    return response.status === 200;
  } catch (error: any) {
    console.log(`[User API] Error uploading profile image:`, error);
    return false;
  }
};

/**
 * 建立人臉辨識會員
 */
export const createFaceRecognitionMember = async (
  userId: number
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/create-face-recognition/${userId}`;
  console.log(
    `[User API] Creating face recognition member for user: ${userId}`
  );

  try {
    const response = await api.post(url);
    console.log(
      `[User API] Face Recognition Member Creation Success:`,
      response.data
    );
    return response.data;
  } catch (error: any) {
    console.log(`[User API] Error creating face recognition member:`, error);
    throw error;
  }
};

/**
 * 查詢人臉辨識會員
 */
export const searchFaceRecognitionMember = async (
  userId: number
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/search-face-recognition/${userId}`;
  console.log(
    `[User API] Searching face recognition member for user: ${userId}`
  );

  try {
    const response = await api.get(url);
    console.log(`[User API] Face Recognition Search Result:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[User API] Error searching face recognition member:`, error);
    throw error;
  }
};

/**
 * 上傳人臉圖片到設備
 */
export const uploadFaceImage = async (
  imageUri: string
): Promise<ApiResponse<string>> => {
  const url = `${API_BASE_URL}${basePath}/upload`;
  console.log(`[User API] Uploading face image to: ${url}`);

  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: `face_upload.jpg`,
      type: 'image/jpeg',
    } as any);

    const response = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log(`[User API] Face Image Upload Success:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[User API] Error uploading face image:`, error);
    throw error;
  }
};

/**
 * 開門操作
 */
export const openDoor = async (): Promise<ApiResponse<string>> => {
  const url = `${API_BASE_URL}${basePath}/openDoor`;
  console.log(`[User API] Requesting to open door at: ${url}`);

  try {
    const response = await api.put(url);
    console.log(`[User API] Open Door Success:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[User API] Error opening door:`, error);
    throw error;
  }
};
