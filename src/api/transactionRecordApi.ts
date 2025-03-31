import { logJson } from '@/utils/logJsonUtils';
import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/transactionRecord`;

/**
 * 交易紀錄 (Transaction Record) 接口
 */
export interface TransactionRecord {
  [key: string]: any;
}

export const fetchUserTransactionRecord = async (): Promise<
  ApiResponse<TransactionRecord[]>
> => {
  const url = `${API_BASE_URL}${basePath}/user`;
  logJson(`[TransactionRecord API] Fetching user transactions from: ${url}`);

  try {
    const response = await api.get<ApiResponse<TransactionRecord[]>>(url);
    logJson(`[TransactionRecord API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[TransactionRecord API] Error fetching user transactions:`, error);
    throw error;
  }
};

export const getPayType = (payTypeId: number): string => {
  const payTypes: Record<number, string> = {
    1: '信用卡',
    2: 'Apple Pay',
    3: 'Google Pay',
  };

  return payTypes[payTypeId] || '未知支付方式';
};
