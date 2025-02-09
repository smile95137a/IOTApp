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
