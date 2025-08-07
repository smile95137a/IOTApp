import { ApiResponse } from '@/vite-env';
import { api } from './AdminApi';

const basePath = '/admin/offering';

/**
 * 查詢供品清單
 */
export const fetchOfferingList = async (): Promise<ApiResponse<any[]>> => {
  try {
    const res = await api.post(`${basePath}/list`);
    return res.data;
  } catch (error) {
    console.error('fetchOfferingList error:', error);
    throw error;
  }
};

/**
 * 新增供品
 */
export const addOffering = async (
  payload: any
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await api.post(`${basePath}/add`, payload);
    return res.data;
  } catch (error) {
    console.error('addOffering error:', error);
    throw error;
  }
};

/**
 * 修改供品
 */
export const modifyOffering = async (
  payload: any
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await api.post(`${basePath}/modify`, payload);
    return res.data;
  } catch (error) {
    console.error('modifyOffering error:', error);
    throw error;
  }
};
