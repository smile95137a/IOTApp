import { api } from './AdminApi';
import type { ApiResponse } from '@/vite-env';

const basePath = '/report';

/**
 * 查詢點燈購買紀錄報表
 */
export const fetchLanternPurchaseReport = async (
  payload: any
): Promise<ApiResponse<any[]>> => {
  try {
    const res = await api.post(`${basePath}/lantern`, payload);
    return res.data;
  } catch (error) {
    console.error('[fetchLanternPurchaseReport] Failed:', error);
    throw error;
  }
};

/**
 * 查詢供品購買紀錄報表
 */
export const fetchOfferingPurchaseReport = async (
  payload: any
): Promise<ApiResponse<any[]>> => {
  try {
    const res = await api.post(`${basePath}/offering`, payload);
    return res.data;
  } catch (error) {
    console.error('[fetchOfferingPurchaseReport] Failed:', error);
    throw error;
  }
};

/**
 * 查詢老師預約紀錄報表
 */
export const fetchMasterReservationReport = async (
  payload: any
): Promise<ApiResponse<any[]>> => {
  try {
    const res = await api.post(`${basePath}/master-reservation`, payload);
    return res.data;
  } catch (error) {
    console.error('[fetchMasterReservationReport] Failed:', error);
    throw error;
  }
};
