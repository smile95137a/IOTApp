import { logJson } from '../utils/logJsonUtils';
import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/gamePay`;

/**
 * 遊戲結帳
 * @param checkoutReq - 包含桌檯、金額、付款方式等資訊
 */
export const checkoutGameGamePay = async (
  checkoutReq: any
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[GameOrder API] POST to: ${url}`);
  logJson('checkoutGameOrder req', checkoutReq);

  try {
    const response = await api.post<ApiResponse<any>>(url, checkoutReq);
    console.log(`[GameOrder API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[GameOrder API] Error during checkout:`, error);
    throw error;
  }
};
