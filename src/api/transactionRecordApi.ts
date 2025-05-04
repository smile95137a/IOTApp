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
  console.log(
    `[TransactionRecord API] Fetching user transactions from: ${url}`
  );

  try {
    const response = await api.get<ApiResponse<TransactionRecord[]>>(url);
    console.log(`[TransactionRecord API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(
      `[TransactionRecord API] Error fetching user transactions:`,
      error
    );
    throw error;
  }
};
export const getPayType = (payTypeId: number): string => {
  const payTypes: Record<number, string> = {
    1: '儲值金',
    2: '信用卡',
    3: 'LINE PAY',
    4: '街口支付',
    5: 'Apple Pay',
  };

  return payTypes[payTypeId] || '未知支付方式';
};
