import { api } from './FrontendAPI';

const basePath = '/transaction';

export interface GameTransactionRecord {
  [key: string]: any;
}

// 取得使用者的所有交易紀錄
export const fetchUserTransactions = async (): Promise<
  ApiResponse<GameTransactionRecord[]>
> => {
  try {
    const response = await api.get<ApiResponse<GameTransactionRecord[]>>(
      `${basePath}/user`
    );
    return response.data;
  } catch (error) {
    console.error('[TransactionService] fetchUserTransactions error:', error);
    throw error;
  }
};

// 依日期範圍取得交易紀錄
export const fetchTransactionsByDateRange = async (
  startDate: string,
  endDate: string
): Promise<ApiResponse<GameTransactionRecord[]>> => {
  try {
    const url = `${basePath}/date-range?startDate=${encodeURIComponent(
      startDate
    )}&endDate=${encodeURIComponent(endDate)}`;
    const response = await api.get<ApiResponse<GameTransactionRecord[]>>(url);
    return response.data;
  } catch (error) {
    console.error(
      '[TransactionService] fetchTransactionsByDateRange error:',
      error
    );
    throw error;
  }
};

// 依交易類型取得交易紀錄
export const fetchTransactionsByType = async (
  transactionType: string
): Promise<ApiResponse<GameTransactionRecord[]>> => {
  try {
    const response = await api.get<ApiResponse<GameTransactionRecord[]>>(
      `${basePath}/type/${encodeURIComponent(transactionType)}`
    );
    return response.data;
  } catch (error) {
    console.error('[TransactionService] fetchTransactionsByType error:', error);
    throw error;
  }
};

// 依交易金額取得交易紀錄
export const fetchTransactionsByAmount = async (
  amount: number
): Promise<ApiResponse<GameTransactionRecord[]>> => {
  try {
    const response = await api.get<ApiResponse<GameTransactionRecord[]>>(
      `${basePath}/amount?amount=${amount}`
    );
    return response.data;
  } catch (error) {
    console.error(
      '[TransactionService] fetchTransactionsByAmount error:',
      error
    );
    throw error;
  }
};
