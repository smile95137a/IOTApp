// src/services/front/orderServices.ts

import { ApiResponse } from '@/vite-env';
import { api } from './FrontAPI';

const basePath = '/order';

/** 建立訂單 */
export const createOrder = async (payload: any): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post(`${basePath}/create`, payload);
    return response.data;
  } catch (error) {
    console.error('createOrder error:', error);
    throw error;
  }
};

/** 查詢訂單列表 */
export const getOrderList = async (
  payload: any
): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.post(`${basePath}/list`, payload);
    return response.data;
  } catch (error) {
    console.error('getOrderList error:', error);
    throw error;
  }
};

/** 查詢訂單詳情 */
export const getOrderDetail = async (
  orderId: string
): Promise<ApiResponse<any>> => {
  try {
    const response = await api.get(`${basePath}/detail/${orderId}`);
    return response.data;
  } catch (error) {
    console.error('getOrderDetail error:', error);
    throw error;
  }
};

/** 取消訂單 */
export const cancelOrder = async (
  payload: any
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post(`${basePath}/cancel`, payload);
    return response.data;
  } catch (error) {
    console.error('cancelOrder error:', error);
    throw error;
  }
};

/** 付款完成通知 */
export const paySuccess = async (
  payload: any
): Promise<ApiResponse<boolean>> => {
  try {
    const response = await api.post(`${basePath}/pay-success`, payload);
    return response.data;
  } catch (error) {
    console.error('paySuccess error:', error);
    throw error;
  }
};

/** 查詢物流方式列表 */
export const getShippingMethodList = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get(`${basePath}/shipping-method/list`);
    return response.data;
  } catch (error) {
    console.error('getShippingMethodList error:', error);
    throw error;
  }
};

/** 查詢發票類型列表 */
export const getInvoiceTypeList = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.get(`${basePath}/invoice-type/list`);
    return response.data;
  } catch (error) {
    console.error('getInvoiceTypeList error:', error);
    throw error;
  }
};

/** 查詢付款方式列表 */
export const getPayMethodList = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await api.post(`${basePath}/pay-method/list`);
    return response.data;
  } catch (error) {
    console.error('getPayMethodList error:', error);
    throw error;
  }
};
