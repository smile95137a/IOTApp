import { logJson } from '@/utils/logJsonUtils';
import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

export interface Store {
  [key: string]: any;
}

const basePath = `/api/b/stores`;

/**
 * 取得所有店家列表
 */
export const fetchAllStores = async (): Promise<ApiResponse<Store[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[Store API] Fetching all stores from: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[Store API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Store API] Error fetching all stores:`, error);
    throw error;
  }
};

/**
 * 根據 UID 取得店家資訊
 * @param uid 店家 UID
 */
export const fetchStoreByUid = async (
  uid: string
): Promise<ApiResponse<Store>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  logJson(`[Store API] Fetching store by UID: ${uid}, URL: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[Store API] Response for UID ${uid}:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Store API] Error fetching store by UID ${uid}:`, error);
    throw error;
  }
};

/**
 * 新增店家
 * @param store 店家資訊
 */
export const createStore = async (
  store: Partial<Store>
): Promise<ApiResponse<Store>> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[Store API] Creating store at: ${url}`);

  try {
    const response = await api.post(url, store);
    logJson(`[Store API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Store API] Error creating store:`, error);
    throw error;
  }
};

/**
 * 更新店家資訊
 * @param uid 店家 UID
 * @param store 更新的店家資訊
 */
export const updateStore = async (
  uid: string,
  store: Partial<Store>
): Promise<ApiResponse<Store>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  logJson(`[Store API] Updating store with UID: ${uid}, URL: ${url}`);

  try {
    const response = await api.put(url, store);
    logJson(`[Store API] Response for UID ${uid}:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Store API] Error updating store with UID ${uid}:`, error);
    throw error;
  }
};

/**
 * 刪除店家
 * @param uid 店家 UID
 */
export const deleteStore = async (uid: string): Promise<ApiResponse<void>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  logJson(`[Store API] Deleting store with UID: ${uid}, URL: ${url}`);

  try {
    const response = await api.delete(url);
    logJson(`[Store API] Store with UID ${uid} deleted successfully.`);
    return response.data;
  } catch (error) {
    logJson(`[Store API] Error deleting store with UID ${uid}:`, error);
    throw error;
  }
};

/**
 * 上傳新聞圖片
 */
export const uploadStoreImages = async (
  userId: number,
  imageUri: string
): Promise<boolean> => {
  const url = `${API_BASE_URL}${basePath}/${userId}/upload-image`;
  logJson(`[Store API] Uploading profile image for user: ${userId} to ${url}`);

  try {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      name: `news_${userId}.jpg`,
      type: 'image/jpeg',
    });

    logJson(`[Store API] FormData:`, formData);

    const response = await api.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    logJson(`[Store API] Profile Image Upload Success:`, response.data);
    return response.status === 200;
  } catch (error) {
    logJson(`[Store API] Error uploading profile image:`, error);
    return false;
  }
};
export const fetchStoresByVendorId = async (
  vendorId: number
): Promise<ApiResponse<Store[]>> => {
  const url = `${API_BASE_URL}${basePath}/${vendorId}/stores`;
  logJson(`[Store API] Fetching stores by vendor ID: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[Store API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Store API] Error fetching stores by vendor ID:`, error);
    throw error;
  }
};
