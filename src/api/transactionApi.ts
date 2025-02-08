import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/transaction`;

export interface GameTransactionRecord {
  id: number;
  userId: number;
  amount: number;
  transactionType: string;
  createdAt: string;
  transactionDate: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// 取得使用者的交易紀錄
export const fetchUserTransactions = async (): Promise<
  ApiResponse<GameTransactionRecord[]>
> => {
  const url = `${API_BASE_URL}${basePath}/user`;
  console.log(`[Transaction API] Fetching user transactions from: ${url}`);

  try {
    const response = await api.get<ApiResponse<GameTransactionRecord[]>>(url);
    console.log(`[Transaction API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[Transaction API] Error fetching user transactions:`, error);
    throw error;
  }
};

// 依日期範圍取得交易紀錄
export const fetchTransactionsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<GameTransactionRecord[]>> => {
  const url = `${API_BASE_URL}${basePath}/date-range?startDate=${encodeURIComponent(
    startDate
  )}&endDate=${encodeURIComponent(endDate)}`;
  console.log(`[Transaction API] Fetching transactions by date range: ${url}`);

  try {
    const response = await api.get<ApiResponse<GameTransactionRecord[]>>(url);
    console.log(`[Transaction API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `[Transaction API] Error fetching transactions by date range:`,
      error
    );
    throw error;
  }
};

// 依交易類型取得交易紀錄
export const fetchTransactionsByType = async (
  transactionType: string
): Promise<ApiResponse<GameTransactionRecord[]>> => {
  const url = `${API_BASE_URL}${basePath}/type/${encodeURIComponent(
    transactionType
  )}`;
  console.log(`[Transaction API] Fetching transactions by type: ${url}`);

  try {
    const response = await api.get<ApiResponse<GameTransactionRecord[]>>(url);
    console.log(`[Transaction API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `[Transaction API] Error fetching transactions by type:`,
      error
    );
    throw error;
  }
};

// 依交易金額取得交易紀錄
export const fetchTransactionsByAmount = async (
  amount: number
): Promise<ApiResponse<GameTransactionRecord[]>> => {
  const url = `${API_BASE_URL}${basePath}/amount?amount=${amount}`;
  console.log(`[Transaction API] Fetching transactions by amount: ${url}`);

  try {
    const response = await api.get<ApiResponse<GameTransactionRecord[]>>(url);
    console.log(`[Transaction API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `[Transaction API] Error fetching transactions by amount:`,
      error
    );
    throw error;
  }
};
