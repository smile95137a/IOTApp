import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/game`;

/**
 * 開始遊戲
 * @param gameReq 開台請求參數
 * @returns API 回應包含遊戲紀錄
 */
export const startGame = async (gameReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/start`;
  console.log(`[Game API] Starting game:`, gameReq);

  try {
    const response = await api.post(url, gameReq);
    console.log(`[Game API] Game started successfully:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[Game API] Error starting game:`, error);
    throw error;
  }
};

/**
 * 結束遊戲
 * @param gameReq 關台請求參數
 * @returns API 回應
 */
export const endGame = async (gameReq: any): Promise<ApiResponse<null>> => {
  const url = `${API_BASE_URL}${basePath}/end`;
  console.log(`[Game API] Ending game:`, gameReq);

  try {
    const response = await api.post(url, gameReq);
    console.log(`[Game API] Game ended successfully`);
    return response.data;
  } catch (error) {
    console.error(`[Game API] Error ending game:`, error);
    throw error;
  }
};

/**
 * 遊戲結帳
 * @param checkoutReq 結帳請求參數
 * @returns API 回應
 */
export const checkoutGame = async (
  checkoutReq: any
): Promise<ApiResponse<null>> => {
  const url = `${API_BASE_URL}${basePath}/checkout`;
  console.log(`[Game API] Checking out game:`, checkoutReq);

  try {
    const response = await api.post(url, checkoutReq);
    console.log(`[Game API] Game checkout successful`);
    return response.data;
  } catch (error) {
    console.error(`[Game API] Error during checkout:`, error);
    throw error;
  }
};

/**
 * 查詢可預約的時段
 * @param storeId 店家 ID
 * @param bookingDate 預約日期（yyyy-MM-dd）
 * @param timeSlotHours 每個時段的時間（小時）
 * @returns 時段清單（字串陣列）
 */
export const getAvailableTimes = async (
  storeId: number,
  bookingDate: string,
  timeSlotHours = 1
): Promise<string[]> => {
  const url = `${API_BASE_URL}${basePath}/available-times?storeId=${storeId}&bookingDate=${bookingDate}&timeSlotHours=${timeSlotHours}`;
  console.log(
    `[Game API] Getting available times for store ${storeId} on ${bookingDate}`
  );

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(`[Game API] Error fetching available times:`, error);
    throw error;
  }
};

/**
 * 預約遊戲
 * @param gameReq 預約請求資料
 * @returns 預約成功後的 GameRecord
 */
export const bookGame = async (gameReq: any): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/book`;
  console.log(`[Game API] Booking game:`, gameReq);

  try {
    const response = await api.post(url, gameReq);
    console.log(`[Game API] Game booked successfully`);
    return response.data;
  } catch (error) {
    console.error(`[Game API] Error booking game:`, error);
    throw error;
  }
};

/**
 * 取消預約
 * @param gameReq 取消預約請求資料
 * @returns 成功訊息
 */
export const cancelBook = async (gameReq: any): Promise<string> => {
  const url = `${API_BASE_URL}${basePath}/cancel`;
  console.log(`[Game API] Canceling booking:`, gameReq);

  try {
    const response = await api.post(url, gameReq);
    return response.data;
  } catch (error) {
    console.error(`[Game API] Error canceling booking:`, error);
    throw error;
  }
};

/**
 * 預約後啟動遊戲
 * @param gameReq 啟動請求資料
 * @returns GameRecord
 */
export const bookStartGame = async (gameReq: any): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/bookStart`;
  console.log(`[Game API] Starting booked game:`, gameReq);

  try {
    const response = await api.post(url, gameReq);
    return response.data;
  } catch (error) {
    console.error(`[Game API] Error starting booked game:`, error);
    throw error;
  }
};
