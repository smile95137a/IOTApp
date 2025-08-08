import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';
const basePath = '/transactionRecord';

export interface TransactionRecord {
  [key: string]: any;
}

/**
 * 取得使用者交易紀錄
 */
export const fetchUserTransactionRecord = async (): Promise<
  ApiResponse<TransactionRecord[]>
> => {
  try {
    const response = await api.get<ApiResponse<TransactionRecord[]>>(
      `${basePath}/user`
    );
    return response.data;
  } catch (error) {
    console.error(
      '[TransactionRecordService] fetchUserTransactionRecord error:',
      error
    );
    throw error;
  }
};

/**
 * 根據支付類型 ID 取得對應文字
 */
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
