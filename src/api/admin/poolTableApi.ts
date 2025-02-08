import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

export interface PoolTable {
  uid: string;
  tableNumber: string;
  status: string;
  storeId: number;
  createTime?: string;
  updateTime?: string;
}

const basePath = `/api/b/poolTables`;

/**
 * 取得所有桌台列表
 */
export const fetchAllPoolTables = async (): Promise<
  ApiResponse<PoolTable[]>
> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[PoolTable API] Fetching all pool tables from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[PoolTable API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[PoolTable API] Error fetching all pool tables:`, error);
    throw error;
  }
};

/**
 * 根據 UID 取得桌台資訊
 * @param uid 桌台 UID
 */
export const fetchPoolTableByUid = async (
  uid: string
): Promise<ApiResponse<PoolTable>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  console.log(
    `[PoolTable API] Fetching pool table by UID: ${uid}, URL: ${url}`
  );

  try {
    const response = await api.get(url);
    console.log(`[PoolTable API] Response for UID ${uid}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `[PoolTable API] Error fetching pool table by UID ${uid}:`,
      error
    );
    throw error;
  }
};

/**
 * 新增桌台
 * @param poolTable 桌台資訊
 */
export const createPoolTable = async (poolTable: {
  tableNumber: string;
  status: string;
  store: { id: number };
  isUse: boolean;
}): Promise<ApiResponse<PoolTable>> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[PoolTable API] Creating pool table at: ${url}`);

  try {
    const response = await api.post(url, poolTable);
    console.log(`[PoolTable API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[PoolTable API] Error creating pool table:`, error);
    throw error;
  }
};

/**
 * 更新桌台資訊
 * @param uid 桌台 UID
 * @param poolTable 更新的桌台資訊
 */
export const updatePoolTable = async (
  uid: string,
  poolTable: {
    tableNumber: string;
    status: string;
    store: { id: number };
    isUse: boolean;
  }
): Promise<ApiResponse<PoolTable>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  console.log(
    `[PoolTable API] Updating pool table with UID: ${uid}, URL: ${url}`
  );

  try {
    const response = await api.put(url, poolTable);
    console.log(`[PoolTable API] Response for UID ${uid}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `[PoolTable API] Error updating pool table with UID ${uid}:`,
      error
    );
    throw error;
  }
};

/**
 * 刪除桌台
 * @param uid 桌台 UID
 */
export const deletePoolTable = async (
  uid: string
): Promise<ApiResponse<void>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  console.log(
    `[PoolTable API] Deleting pool table with UID: ${uid}, URL: ${url}`
  );

  try {
    const response = await api.delete(url);
    console.log(
      `[PoolTable API] Pool table with UID ${uid} deleted successfully.`
    );
    return response.data;
  } catch (error) {
    console.error(
      `[PoolTable API] Error deleting pool table with UID ${uid}:`,
      error
    );
    throw error;
  }
};
