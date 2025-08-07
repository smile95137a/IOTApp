import { ApiResponse } from '@/vite-env';
import { api } from './AdminApi';

const basePath = '/admin/banner';

/**
 * 依類型查詢後台 banner
 */
export const fetchAdminBannerByType = async (
  type: string
): Promise<ApiResponse<any[]>> => {
  try {
    const res = await api.post(`${basePath}/list/${type}`);
    return res.data;
  } catch (error) {
    console.error('fetchAdminBannerByType error:', error);
    throw error;
  }
};

/**
 * 查詢單一 banner
 */
export const fetchBannerById = async (id: any): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post(`${basePath}/${id}`);
    return res.data;
  } catch (error) {
    console.error('fetchBannerById error:', error);
    throw error;
  }
};

/**
 * 新增 banner
 */
export const addBanner = async (
  payload: any
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await api.post(`${basePath}/add`, payload);
    return res.data;
  } catch (error) {
    console.error('addBanner error:', error);
    throw error;
  }
};

/**
 * 修改 banner
 */
export const modifyBanner = async (
  payload: any
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await api.post(`${basePath}/modify`, payload);
    return res.data;
  } catch (error) {
    console.error('modifyBanner error:', error);
    throw error;
  }
};
