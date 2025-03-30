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
  console.log(`[Game API]  startGame req:`, gameReq);
  try {
    const response = await api.post(url, gameReq);
    console.log(`[Game API]  startGame res:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Game API]  startGame error:`, error);
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
  console.log(`[Game API]  checkoutGame req:`, checkoutReq);
  try {
    const response = await api.post(url, checkoutReq);
    console.log(`[Game API]  checkoutGame res:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Game API]  checkoutGame error:`, error);
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
  console.log(`[Game API]  getAvailableTimes params:`, params);
  try {
    const response = await api.get(url, {
      params: {
        storeId,
        bookingDate,
        poolTableId,
      },
    });
    console.log(`[Game API]  getAvailableTimes res:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Game API]  getAvailableTimes error:`, error);
    throw error;
  }
};

/**
 * 預約遊戲
 */
export const bookGame = async (bookReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/book`;
  console.log(`[Game API]  bookGame req:`, bookReq);
  try {
    const response = await api.post(url, bookReq);
    console.log(`[Game API]  bookGame res:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Game API]  bookGame error:`, error);
    throw error;
  }
};

/**
 * 取消預約
 */
export const cancelBook = async (gameReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/cancel`;
  console.log(`[Game API]  cancelBook req:`, gameReq);
  try {
    const response = await api.post(url, gameReq);
    console.log(`[Game API]  cancelBook res:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Game API]  cancelBook error:`, error);
    throw error;
  }
};

/**
 * 預約開台
 */
export const bookStart = async (gameReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/bookStart`;
  console.log(`[Game API]  bookStart req:`, gameReq);
  try {
    const response = await api.post(url, gameReq);
    console.log(`[Game API]  bookStart res:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Game API]  bookStart error:`, error);
    throw error;
  }
};

export const getBookGameList = async (): Promise<ApiResponse<any[]>> => {
  const url = `${API_BASE_URL}${basePath}/getBookGame`;
  console.log(`[Game API]  getBookGame`);
  try {
    const response = await api.get(url);
    console.log(`[Game API]  getBookGame res:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Game API]  getBookGame error:`, error);
    throw error;
  }
};
