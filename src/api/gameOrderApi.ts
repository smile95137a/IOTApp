import { logJson } from '@/utils/logJsonUtils';
import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/game-order`;

// 取得使用者的遊戲訂單紀錄
export const fetchGameOrders = async (): Promise<ApiResponse<any[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[GameOrder API] Fetching game orders from: ${url}`);

  try {
    const response = await api.get<ApiResponse<any[]>>(url);
    logJson(`[GameOrder API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[GameOrder API] Error fetching game orders:`, error);
    throw error;
  }
};
