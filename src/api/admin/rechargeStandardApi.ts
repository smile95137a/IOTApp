import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas?.API_BASE_URL || 'http://172.20.10.4:8081';
const basePath = `/api/b/recharge-standards`;

/**
 * 取得所有儲值標準
 */
export const fetchAllRechargeStandards = async (): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[RechargeStandard API] GET ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[RechargeStandard API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[RechargeStandard API] Error:`, error);
    throw error;
  }
};

/**
 * 取得單一儲值標準
 */
export const fetchRechargeStandard = async (id: number): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  console.log(`[RechargeStandard API] GET ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[RechargeStandard API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[RechargeStandard API] Error:`, error);
    throw error;
  }
};

/**
 * 建立儲值標準
 */
export const createRechargeStandard = async (req: any): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[RechargeStandard API] POST ${url}`, req);

  try {
    const response = await api.post(url, req);
    console.log(`[RechargeStandard API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[RechargeStandard API] Error:`, error);
    throw error;
  }
};

/**
 * 更新儲值標準
 */
export const updateRechargeStandard = async (
  id: number,
  req: any
): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  console.log(`[RechargeStandard API] PUT ${url}`, req);

  try {
    const response = await api.put(url, req);
    console.log(`[RechargeStandard API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[RechargeStandard API] Error:`, error);
    throw error;
  }
};

/**
 * 刪除儲值標準
 */
export const deleteRechargeStandard = async (id: number): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  console.log(`[RechargeStandard API] DELETE ${url}`);

  try {
    const response = await api.delete(url);
    console.log(`[RechargeStandard API] Response:`, response.data);
    return response.data;
  } catch (error: any) {
    console.log(`[RechargeStandard API] Error:`, error);
    throw error;
  }
};
