import { ApiResponse } from '@/vite-env';
import { api } from './AdminApi';

const basePath = '/admin/product/category';

/**
 * 取得商品分類清單
 */
export const fetchCategoryList = async (): Promise<ApiResponse<any[]>> => {
  try {
    const res = await api.post(`${basePath}/list`);
    return res.data;
  } catch (error) {
    console.error('fetchCategoryList error:', error);
    throw error;
  }
};

/**
 * 新增商品分類
 */
export const addCategory = async (
  payload: any
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await api.post(`${basePath}/add`, payload);
    return res.data;
  } catch (error) {
    console.error('addCategory error:', error);
    throw error;
  }
};

/**
 * 修改商品分類
 */
export const modifyCategory = async (
  payload: any
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await api.post(`${basePath}/modify`, payload);
    return res.data;
  } catch (error) {
    console.error('modifyCategory error:', error);
    throw error;
  }
};

/**
 * 取得單一商品分類
 */
export const fetchCategoryById = async (
  id: string
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post(`${basePath}/${id}`);
    return res.data;
  } catch (error) {
    console.error('fetchCategoryById error:', error);
    throw error;
  }
};
