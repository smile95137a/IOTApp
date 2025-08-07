import { api } from './AdminApi';
import type { ApiResponse } from '@/vite-env';

const basePath = '/admin/stock';

/**
 * 查詢所有商品庫存
 */
export const fetchAllProductStocks = async (): Promise<ApiResponse<any[]>> => {
  try {
    const res = await api.get(`${basePath}/list`);
    return res.data;
  } catch (error) {
    console.error('[fetchAllProductStocks] Failed:', error);
    throw error;
  }
};

/**
 * 查詢單一商品庫存
 */
export const fetchProductStockById = async (
  productId: string
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.get(`${basePath}/${productId}`);
    return res.data;
  } catch (error) {
    console.error('[fetchProductStockById] Failed:', error);
    throw error;
  }
};

/**
 * 調整商品總庫存
 */
export const adjustProductTotalStock = async (
  productId: string,
  payload: {
    totalStock: number;
    remark?: string;
  }
): Promise<ApiResponse<void>> => {
  try {
    const res = await api.post(`${basePath}/${productId}/adjust`, payload);
    return res.data;
  } catch (error) {
    console.error('[adjustProductTotalStock] Failed:', error);
    throw error;
  }
};
