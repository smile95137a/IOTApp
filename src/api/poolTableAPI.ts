import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

import { api } from './ApiClient';

export interface PoolTable {
  id: number;
  uid: string;
  tableNumber: string;
  status: string;
  store: Store;
  tableEquipments: TableEquipment[];
  createTime?: string;
  createUserId?: number;
  updateTime?: string;
  updateUserId?: number;
  isUse: boolean;
}

export interface Store {
  id: number;
  uid: string;
  name: string;
  address: string;
  image?: string;
}

export interface TableEquipment {
  id: number;
  name: string;
  quantity: number;
}

const basePath = '/portable';

/**
 * 根據 storeUid 取得該門市的桌台資訊
 * @param storeUid 門市 UID
 * @returns 桌台列表
 */
export const fetchPoolTablesByStoreUid = async (
  storeUid: string
): Promise<ApiResponse<PoolTable[]>> => {
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
    console.error(
      `[PoolTable API] Error fetching pool tables for storeUid ${storeUid}:`,
      error
    );
    throw error;
  }
};
