import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/payment`;

/**
 * 儲值 (Top-up) 請求介面
 */
export interface TopOpReq {
  [key: string]: any;
}

/**
 * 執行儲值請求
 */
export const topUp = async (
  topOpReq: TopOpReq
): Promise<ApiResponse<Boolean>> => {
  const url = `${API_BASE_URL}${basePath}/topOp`;
  console.log(`[Payment API] Processing top-up at: ${url}`);

  try {
    const response = await api.post<ApiResponse<Boolean>>(url, topOpReq);
    console.log(`[Payment API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[Payment API] Error processing top-up:`, error);
    throw error;
  }
};

export const getUserUse = async (): Promise<ApiResponse<boolean>> => {
  const url = `${API_BASE_URL}${basePath}/isUse`;
  console.log(`[Payment API] Get user use status: ${url}`);
  try {
    const response = await api.get<ApiResponse<boolean>>(url);
    return response.data;
  } catch (error: any) {
    console.error(`[Payment API] Get user use error:`, error);
    throw error;
  }
};
