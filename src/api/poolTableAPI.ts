import Constants from 'expo-constants';
import { api } from './ApiClient';

const extra = Constants.expoConfig?.extra || {}; // 確保不為 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = '/portable';

/**
 * 根據 `storeUid` 取得該門市的桌台資訊
 * @param storeUid 門市 UID
 * @returns 桌台列表
 */
export const fetchPoolTablesByStoreUid = async (
  storeUid: string
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/store/${storeUid}`;
  console.log(
    `[PoolTable API] Fetching pool tables for storeUid: ${storeUid}, URL: ${url}`
  );

  try {
    const response = await api.get(url);
    console.log(
      `[PoolTable API] Response for storeUid ${storeUid}:`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.log(
      `[PoolTable API] Error fetching pool tables for storeUid ${storeUid}:`,
      error
    );
    throw error;
  }
};

/**
 * 根據 `uid` 取得單一桌檯資訊
 * @param uid 桌檯 UID
 * @returns 桌檯詳細資訊
 */
export const fetchPoolTableByUid = async (
  uid: string
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  console.log(
    `[PoolTable API] Fetching pool table with UID: ${uid}, URL: ${url}`
  );

  try {
    const response = await api.get(url);
    console.log(`[PoolTable API] Response for UID ${uid}:`, response.data);
    return response.data;
  } catch (error) {
    console.log(
      `[PoolTable API] Error fetching pool table with UID ${uid}:`,
      error
    );
    throw error;
  }
};
