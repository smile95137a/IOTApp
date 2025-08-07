import { api } from './FrontendAPI';

const basePath = '/portable';

/**
 * 根據門市 UID 取得桌檯列表
 * @param storeUid 門市 UID
 */
export const fetchPoolTablesByStoreUid = async (
  storeUid: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `${basePath}/store/${storeUid}`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching pool tables for storeUid ${storeUid}:`,
      error
    );
    throw error;
  }
};

/**
 * 根據桌台 UID 查詢單一桌台資訊
 * @param uid 桌台 UID
 */
export const fetchPoolTableByUid = async (
  uid: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get<ApiResponse<any>>(`${basePath}/${uid}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pool table with UID ${uid}:`, error);
    throw error;
  }
};
