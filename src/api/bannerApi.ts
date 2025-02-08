import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/banner`;

/**
 * Banner 介面
 */
export interface Banner {
  bannerId: number;
  bannerUid: string;
  imageUrl: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  news: any;
}

/**
 * 取得所有 Banners
 */
export const fetchAllBanners = async (): Promise<ApiResponse<Banner[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[Banner API] Fetching all banners from: ${url}`);

  try {
    const response = await api.get<ApiResponse<Banner[]>>(url);
    console.log(`[Banner API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[Banner API] Error fetching banners:`, error);
    throw error;
  }
};
