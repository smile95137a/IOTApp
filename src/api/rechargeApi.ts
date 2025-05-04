import { logJson } from '../utils/logJsonUtils';
import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/recharge`;

/**
 * 取得有效儲值方案列表
 */
export const fetchRechargeStandards = async (): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/standard`;
  console.log(`[Recharge API] Fetching recharge standards from: ${url}`);

  try {
    const response = await api.get(url);
    logJson('[Recharge API] Response', response.data);
    return response.data;
  } catch (error: any) {
    console.error('[Recharge API] Error:', error);
    throw error;
  }
};
