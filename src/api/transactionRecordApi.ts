import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/transactionRecord`;

/**
 * 交易紀錄 (Transaction Record) 接口
 */
export interface TransactionRecord {
  id: number; // 交易紀錄 ID
  userId: number; // 交易關聯的用戶 ID
  amount: number; // 消費金額
  transactionType: string; // 交易類型（如 "儲值", "購買", "退款"）
  payType: string; // 付款方式（如 "信用卡", "電子錢包"）
  createdAt: string; // 創建時間
  transactionDate: string; // 交易日期
  location?: string; // 交易地點 (可選)
  details?: string; // 交易詳情 (可選)
  updatedAt?: string; // 更新時間 (可選)
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
  } catch (error) {
    console.log(
      `[TransactionRecord API] Error fetching user transactions:`,
      error
    );
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
