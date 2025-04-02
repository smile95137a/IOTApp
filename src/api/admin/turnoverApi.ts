import { logJson } from '@/utils/logJsonUtils';
import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas?.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/api/b/turnover`;

/**
 * 取得目前登入使用者的總營業額（Turnover）
 */
export const fetchTurnover = async (): Promise<ApiResponse<string>> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[Turnover API] Fetching turnover from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[Turnover API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Turnover API] Error fetching turnover:`, error);
    throw error;
  }
};
