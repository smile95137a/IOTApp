import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas?.API_BASE_URL || 'http://172.20.10.4:8081';
const basePath = `/api/b/recharge/promotion`;

/**
 * 建立儲值優惠
 */
export const createRechargePromotion = async (req: any): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[RechargePromotion API] POST ${url}`, req);

  try {
    const response = await api.post(url, req);
    console.log(`[RechargePromotion API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[RechargePromotion API] Error:`, error);
    throw error;
  }
};

/**
 * 更新儲值優惠
 */
export const updateRechargePromotion = async (
  id: number,
  req: any
): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  console.log(`[RechargePromotion API] PUT ${url}`, req);

  try {
    const response = await api.put(url, req);
    console.log(`[RechargePromotion API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[RechargePromotion API] Error:`, error);
    throw error;
  }
};

/**
 * 取得單一儲值優惠
 */
export const fetchRechargePromotion = async (id: number): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  console.log(`[RechargePromotion API] GET ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[RechargePromotion API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[RechargePromotion API] Error:`, error);
    throw error;
  }
};

/**
 * 取得所有儲值優惠
 */
export const fetchAllRechargePromotions = async (): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[RechargePromotion API] GET ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[RechargePromotion API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[RechargePromotion API] Error:`, error);
    throw error;
  }
};

/**
 * 刪除儲值優惠
 */
export const deleteRechargePromotion = async (id: number): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  console.log(`[RechargePromotion API] DELETE ${url}`);

  try {
    const response = await api.delete(url);
    console.log(`[RechargePromotion API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[RechargePromotion API] Error:`, error);
    throw error;
  }
};
