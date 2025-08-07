// src/services/front/productServices.ts
import {
  ProductCategoryVO,
  ProductListRequest,
  ProductVO,
  ProductDetailVO,
  ApiResponse,
} from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/product';

/**
 * 取得可用商品分類列表
 */
export const getCategoryAvailableList = async (): Promise<
  ApiResponse<ProductCategoryVO[]>
> => {
  try {
    const response = await api.post<ApiResponse<ProductCategoryVO[]>>(
      `${basePath}/category/list`
    );
    return response.data;
  } catch (error) {
    console.error('getCategoryAvailableList error:', error);
    throw error;
  }
};

/**
 * 查詢商品列表（依分類）
 */
export const getProductListByCategory = async (
  payload: ProductListRequest
): Promise<ApiResponse<ProductVO[]>> => {
  try {
    const response = await api.post<ApiResponse<ProductVO[]>>(
      `${basePath}/list`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error('getProductListByCategory error:', error);
    throw error;
  }
};

/**
 * 查詢商品詳細資訊
 */
export const getProductDetail = async (
  productId: number
): Promise<ApiResponse<ProductDetailVO>> => {
  try {
    const response = await api.get<ApiResponse<ProductDetailVO>>(
      `${basePath}/info/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error('getProductDetail error:', error);
    throw error;
  }
};
