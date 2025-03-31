import { logJson } from '@/utils/logJsonUtils';
import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas?.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/game`;

/**
 * 開始遊戲
 */
export const startGame = async (gameReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/start`;
  logJson(`[Game API]  startGame req:`, gameReq);
  try {
    const response = await api.post(url, gameReq);
    logJson(`[Game API]  startGame res:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Game API]  startGame error:`, error);
    throw error;
  }
};

/**
 * 結帳遊戲
 */
export const checkoutGame = async (
  checkoutReq: any
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/checkout`;
  logJson(`[Game API]  checkoutGame req:`, checkoutReq);
  try {
    const response = await api.post(url, checkoutReq);
    logJson(`[Game API]  checkoutGame res:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Game API]  checkoutGame error:`, error);
    throw error;
  }
};

/**
 * 查詢可預約時間
 */
export const getAvailableTimes = async (
  storeId: number,
  bookingDate: string,
  poolTableId: number
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/available-times`;
  const params = { storeId, bookingDate, poolTableId };
  logJson(`[Game API]  getAvailableTimes params:`, params);
  try {
    const response = await api.get(url, {
      params: {
        storeId,
        bookingDate,
        poolTableId,
      },
    });
    logJson(`[Game API]  getAvailableTimes res:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Game API]  getAvailableTimes error:`, error);
    throw error;
  }
};

/**
 * 預約遊戲
 */
export const bookGame = async (bookReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/book`;
  logJson(`[Game API]  bookGame req:`, bookReq);
  try {
    const response = await api.post(url, bookReq);
    logJson(`[Game API]  bookGame res:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Game API]  bookGame error:`, error);
    throw error;
  }
};

/**
 * 取消預約
 */
export const cancelBook = async (gameReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/cancel`;
  logJson(`[Game API]  cancelBook req:`, gameReq);
  try {
    const response = await api.post(url, gameReq);
    logJson(`[Game API]  cancelBook res:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Game API]  cancelBook error:`, error);
    throw error;
  }
};

/**
 * 預約開台
 */
export const bookStart = async (gameReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/bookStart`;
  logJson(`[Game API]  bookStart req:`, gameReq);
  try {
    const response = await api.post(url, gameReq);
    logJson(`[Game API]  bookStart res:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Game API]  bookStart error:`, error);
    throw error;
  }
};

export const getBookGameList = async (): Promise<ApiResponse<any[]>> => {
  const url = `${API_BASE_URL}${basePath}/getBookGame`;
  logJson(`[Game API]  getBookGame`);
  try {
    const response = await api.get(url);
    logJson(`[Game API]  getBookGame res:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Game API]  getBookGame error:`, error);
    throw error;
  }
};
