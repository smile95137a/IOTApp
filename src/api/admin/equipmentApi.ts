import { logJson } from '@/utils/logJsonUtils';
import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas?.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/api/b/equipment`;

/**
 * 取得所有桌台設備
 */
export const fetchAllTableEquipments = async (): Promise<
  ApiResponse<any[]>
> => {
  const url = `${API_BASE_URL}${basePath}/table`;
  logJson(`[Equipment API] Fetching all table equipments from: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error fetching table equipments:`, error);
    throw error;
  }
};

/**
 * 取得所有店家設備
 */
export const fetchAllStoreEquipments = async (): Promise<
  ApiResponse<any[]>
> => {
  const url = `${API_BASE_URL}${basePath}/store`;
  logJson(`[Equipment API] Fetching all store equipments from: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error fetching store equipments:`, error);
    throw error;
  }
};
export const fetchStoreEquipmentsByStoreId = async (
  storeId: number
): Promise<ApiResponse<any[]>> => {
  const url = `${API_BASE_URL}${basePath}/store/${storeId}`;
  logJson(
    `[Equipment API] Fetching store equipments by storeId ${storeId}: ${url}`
  );
  return api.get(url).then((res) => res.data);
};
/**
 * 取得單個桌台設備
 */
export const fetchTableEquipmentById = async (
  id: number
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/table/${id}`;
  logJson(`[Equipment API] Fetching table equipment with ID: ${id}`);

  try {
    const response = await api.get(url);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error fetching table equipment:`, error);
    throw error;
  }
};

/**
 * 取得單個店家設備
 */
export const fetchStoreEquipmentById = async (
  id: number
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/store/${id}`;
  logJson(`[Equipment API] Fetching store equipment with ID: ${id}`);

  try {
    const response = await api.get(url);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error fetching store equipment:`, error);
    throw error;
  }
};

/**
 * 創建桌台設備
 */
export const createTableEquipment = async (
  equipment: any
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/table`;
  logJson(`[Equipment API] Creating table equipment`);

  try {
    const response = await api.post(url, equipment);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error creating table equipment:`, error);
    throw error;
  }
};

/**
 * 更新桌台設備
 */
export const updateTableEquipment = async (
  id: number,
  equipment: any
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/table/${id}`;
  logJson(`[Equipment API] Updating table equipment with ID: ${id}`);

  try {
    const response = await api.put(url, equipment);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error updating table equipment:`, error);
    throw error;
  }
};

/**
 * 創建店家設備
 */
export const createStoreEquipment = async (
  equipment: any
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/store`;
  logJson(`[Equipment API] Creating store equipment`, equipment);

  try {
    const response = await api.post(url, equipment);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error creating store equipment:`, error);
    throw error;
  }
};

/**
 * 更新店家設備
 */
export const updateStoreEquipment = async (
  id: number,
  equipment: any
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/store/${id}`;
  logJson(`[Equipment API] Updating store equipment with ID: ${id}`);

  try {
    const response = await api.put(url, equipment);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error updating store equipment:`, error);
    throw error;
  }
};

/**
 * 刪除桌台設備
 */
export const deleteTableEquipment = async (
  id: number
): Promise<ApiResponse<void>> => {
  const url = `${API_BASE_URL}${basePath}/table/${id}`;
  logJson(`[Equipment API] Deleting table equipment with ID: ${id}`);

  try {
    const response = await api.delete(url);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error deleting table equipment:`, error);
    throw error;
  }
};

/**
 * 刪除店家設備
 */
export const deleteStoreEquipment = async (
  id: number
): Promise<ApiResponse<void>> => {
  const url = `${API_BASE_URL}${basePath}/store/${id}`;
  logJson(`[Equipment API] Deleting store equipment with ID: ${id}`);

  try {
    const response = await api.delete(url);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error deleting store equipment:`, error);
    throw error;
  }
};

/**
 * 啟用/禁用桌台設備
 */
export const updateTableEquipmentStatus = async (
  id: number,
  status: boolean
): Promise<ApiResponse<void>> => {
  const url = `${API_BASE_URL}${basePath}/table/${id}/status?status=${status}`;
  logJson(`[Equipment API] Updating table equipment status for ID: ${id}`);

  try {
    const response = await api.put(url);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error updating table equipment status:`, error);
    throw error;
  }
};

/**
 * 啟用/禁用店家設備
 */
export const updateStoreEquipmentStatus = async (
  id: number,
  status: boolean
): Promise<ApiResponse<void>> => {
  const url = `${API_BASE_URL}${basePath}/store/${id}/status?status=${status}`;
  logJson(`[Equipment API] Updating store equipment status for ID: ${id}`);

  try {
    const response = await api.put(url);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error updating store equipment status:`, error);
    throw error;
  }
};
export const fetchTableEquipmentsByTableId = async (
  tableId: number
): Promise<ApiResponse<any[]>> => {
  const url = `${API_BASE_URL}${basePath}/table/${tableId}`;
  logJson(
    `[Equipment API] Fetching table equipments for table ID ${tableId}: ${url}`
  );

  try {
    const response = await api.get(url);
    logJson(`[Equipment API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Equipment API] Error fetching table equipments:`, error);
    throw error;
  }
};
