import { ApiResponse, CountRequest } from '@/vite-env';
import { api } from './AdminApi';

const basePath = '/system/config';

/**
 * 查詢推薦點燈清單
 */
export const fetchPromotionLanternList = async (): Promise<
  ApiResponse<string[]>
> => {
  try {
    const res = await api.get(`${basePath}/promotion-lantern`);
    return res.data;
  } catch (error) {
    console.error('fetchPromotionLanternList error:', error);
    throw error;
  }
};

/**
 * 更新推薦點燈清單
 */
export const updatePromotionLanternList = async (
  lanternIds: string[]
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await api.post(`${basePath}/promotion-lantern`, lanternIds);
    return res.data;
  } catch (error) {
    console.error('updatePromotionLanternList error:', error);
    throw error;
  }
};

/**
 * 查詢要疊加的點燈購買數字
 */
export const fetchPurchaseLanternCount = async (): Promise<
  ApiResponse<number>
> => {
  try {
    const res = await api.get(`${basePath}/lantern-count`);
    return res.data;
  } catch (error) {
    console.error('fetchPurchaseLanternCount error:', error);
    throw error;
  }
};

/**
 * 更新要疊加的點燈購買數字
 */
export const updatePurchaseLanternCount = async (
  req: CountRequest
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await api.post(`${basePath}/lantern-count`, req);
    return res.data;
  } catch (error) {
    console.error('updatePurchaseLanternCount error:', error);
    throw error;
  }
};
