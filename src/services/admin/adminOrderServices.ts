import { api } from './AdminApi';
import type { ApiResponse } from '@/vite-env';

const basePath = '/admin/order';

/**
 * 查詢訂單列表
 */
export const fetchOrderList = async (
  payload: any
): Promise<ApiResponse<any[]>> => {
  try {
    const res = await api.post(`${basePath}/list`, payload);
    return res.data;
  } catch (error) {
    console.error('[fetchOrderList] Failed:', error);
    throw error;
  }
};

/**
 * 查詢訂單詳情
 */
export const fetchOrderDetail = async (
  orderId: string
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.get(`${basePath}/detail/${orderId}`);
    return res.data;
  } catch (error) {
    console.error('[fetchOrderDetail] Failed:', error);
    throw error;
  }
};

/**
 * 批次更新訂單狀態
 */
export const updateOrderStatusBatch = async (
  payload: any
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await api.post(`${basePath}/status/batch-update`, payload);
    return res.data;
  } catch (error) {
    console.error('[updateOrderStatusBatch] Failed:', error);
    throw error;
  }
};

/**
 * 儲存物流資訊
 */
export const saveShippingMethod = async (
  payload: any
): Promise<ApiResponse<boolean>> => {
  try {
    const res = await api.post(`${basePath}/shipping-method/save`, payload);
    return res.data;
  } catch (error) {
    console.error('[saveShippingMethod] Failed:', error);
    throw error;
  }
};

/**
 * 查詢物流方式列表
 */
export const fetchShippingMethodList = async (): Promise<
  ApiResponse<any[]>
> => {
  try {
    const res = await api.get(`${basePath}/shipping-method/list`);
    return res.data;
  } catch (error) {
    console.error('[fetchShippingMethodList] Failed:', error);
    throw error;
  }
};

/**
 * 查詢可更新狀態列表
 */
export const fetchUpdatableOrderStatusList = async (): Promise<
  ApiResponse<any[]>
> => {
  try {
    const res = await api.get(`${basePath}/status/updatable-list`);
    return res.data;
  } catch (error) {
    console.error('[fetchUpdatableOrderStatusList] Failed:', error);
    throw error;
  }
};

/**
 * 查詢出貨單資訊
 */
export const fetchDeliveryNote = async (
  orderId: string
): Promise<ApiResponse<any>> => {
  try {
    const res = await api.get(`${basePath}/delivery-note/${orderId}`);
    return res.data;
  } catch (error) {
    console.error('[fetchDeliveryNote] Failed:', error);
    throw error;
  }
};
