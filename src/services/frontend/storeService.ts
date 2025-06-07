import { api } from './FrontendAPI';

const basePath = '/stores';

export interface Store {
  [key: string]: any;
}

/**
 * 取得所有店家列表
 */
export const fetchAllStores = async (): Promise<ApiResponse<Store[]>> => {
  try {
    const response = await api.get<ApiResponse<Store[]>>(basePath);
    return response.data;
  } catch (error) {
    console.error('Error fetching all stores:', error);
    throw error;
  }
};

/**
 * 根據 UID 查詢店家資訊
 * @param uid 店家 UID
 */
export const fetchStoreByUid = async (
  uid: string
): Promise<ApiResponse<Store[]>> => {
  try {
    const response = await api.get<ApiResponse<Store[]>>(`${basePath}/${uid}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching store by UID ${uid}:`, error);
    throw error;
  }
};
