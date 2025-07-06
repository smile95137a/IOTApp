import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas?.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/api/b/router`;

/**
 * 取得指定店家的所有 Router
 */
export const fetchRoutersByStoreId = async (storeId: number): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/store/${storeId}`;
  console.log(`[Router API] Fetching routers for store: ${storeId}`);
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('[Router API] Error fetching routers:', error);
    throw error;
  }
};

/**
 * 取得某桌檯對應的 Router（含是否被綁定）
 */
export const fetchRoutersWithTableInfo = async (
  storeId: number,
  poolTableId: number
): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/store/${storeId}/${poolTableId}`;
  console.log(
    `[Router API] Fetching routers with table info: store=${storeId}, table=${poolTableId}`
  );
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error(
      '[Router API] Error fetching routers with table info:',
      error
    );
    throw error;
  }
};

/**
 * 新增 Router
 */
export const createRouter = async (request: any): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[Router API] Creating router:`, request);
  try {
    const response = await api.post(url, request);
    return response.data;
  } catch (error) {
    console.error('[Router API] Error creating router:', error);
    throw error;
  }
};

/**
 * 更新 Router 設定
 */
export const updateRouter = async (id: number, request: any): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  console.log(`[Router API] Updating router ${id}:`, request);
  try {
    const response = await api.put(url, request);
    return response.data;
  } catch (error) {
    console.error(`[Router API] Error updating router ${id}:`, error);
    throw error;
  }
};

/**
 * 刪除 Router
 */
export const deleteRouter = async (id: number): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  console.log(`[Router API] Deleting router ${id}`);
  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.error(`[Router API] Error deleting router ${id}:`, error);
    throw error;
  }
};

/**
 * 取得 Router 類型選項
 */
export const fetchRouterTypes = async (): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/types`;
  console.log(`[Router API] Fetching router types`);
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('[Router API] Error fetching router types:', error);
    throw error;
  }
};

/**
 * 控制 Router 的電路開關
 */
export const controlRouter = async (request: any): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/control`;
  console.log(`[Router API] Controlling router:`, request);
  try {
    const response = await api.post(url, request);
    return response.data;
  } catch (error) {
    console.error('[Router API] Error controlling router:', error);
    throw error;
  }
};
