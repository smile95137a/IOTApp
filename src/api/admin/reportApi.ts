import { logJson } from '@/utils/logJsonUtils';
import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/api/b/reports`;

// 取得報告數據
export const fetchReportData = async (reportRequest: any): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[Report API] Fetching report data from: ${url}`, reportRequest);

  try {
    const response = await api.post(url, reportRequest);
    logJson(`[Report API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Report API] Error fetching report data:`, error);
    throw error;
  }
};
