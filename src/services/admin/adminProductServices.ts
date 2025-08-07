import { ApiResponse } from '@/vite-env';
import { api } from './AdminApi';

const basePath = '/admin/product';

/**
 * 建立商品草稿，取得商品 ID
 */
export const createProductDraft = async (): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post(`${basePath}/draft`);
    return res.data;
  } catch (error) {
    console.error('[createProductDraft] Failed:', error);
    throw error;
  }
};

/**
 * 上傳商品圖片
 */
export const uploadProductImage = async (
  data: any
): Promise<ApiResponse<any>> => {
  try {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('productId', data.productId.toString());
    formData.append('type', data.type);

    const res = await api.post(`${basePath}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (error) {
    console.error('[uploadProductImage] Failed:', error);
    throw error;
  }
};

/**
 * 編輯商品
 */
export const editProduct = async (data: any): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post(`${basePath}/edit`, data);
    return res.data;
  } catch (error) {
    console.error('[editProduct] Failed:', error);
    throw error;
  }
};

/**
 * 丟棄商品草稿
 */
export const discardProduct = async (data: any): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post(`${basePath}/discard`, data);
    return res.data;
  } catch (error) {
    console.error('[discardProduct] Failed:', error);
    throw error;
  }
};

/**
 * 查詢商品詳細資料
 */
export const fetchProductDetail = async (
  productId: number
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.get(`${basePath}/${productId}`);
    return res.data;
  } catch (error) {
    console.error('[fetchProductDetail] Failed:', error);
    throw error;
  }
};

/**
 * 刪除商品圖片
 */
export const deleteProductImage = async (
  data: any
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post(`${basePath}/delete-image`, data);
    return res.data;
  } catch (error) {
    console.error('[deleteProductImage] Failed:', error);
    throw error;
  }
};

/**
 * 查詢商品列表（分頁）
 */
export const getProductList = async (data: any): Promise<ApiResponse<any>> => {
  try {
    const res = await api.post(`${basePath}/list`, data);
    return res.data;
  } catch (error) {
    console.error('[getProductList] Failed:', error);
    throw error;
  }
};
