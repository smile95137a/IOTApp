import { logJson } from '@/utils/logJsonUtils';
import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

export interface Store {
  [key: string]: any;
}

const basePath = `/stores`;

/**
 * 取得所有店家列表
 */
export const fetchAllStores = async (): Promise<ApiResponse<Store[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[Store API] Fetching all stores from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[Store API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Store API] Error fetching stores:`, error);
    throw error;
  }
};

/**
 * 根據 UID 查詢店家資訊
 * @param uid 店家 UID
 */
export const fetchStoreByUid = async (
  uid: string
): Promise<ApiResponse<Store[]>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  console.log(`[Store API] Fetching store by UID: ${uid}, URL: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[Store API] Response for UID ${uid}:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Store API] Error fetching store by UID ${uid}:`, error);
    throw error;
  }
};
