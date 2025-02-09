import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/game-records`;

// 取得使用者的遊戲紀錄
export const fetchGameRecords = async (): Promise<ApiResponse<any[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[GameRecord API] Fetching game records from: ${url}`);

  try {
    const response = await api.get<ApiResponse<any[]>>(url);
    console.log(`[GameRecord API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[GameRecord API] Error fetching game records:`, error);
    throw error;
  }
};
