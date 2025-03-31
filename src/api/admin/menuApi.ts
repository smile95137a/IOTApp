import { logJson } from '@/utils/logJsonUtils';
import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

export interface Menu {
  [key: string]: any;
}

const basePath = `/api/b/menus`;

/**
 * 取得所有菜單（支援樹形結構）
 */
export const fetchAllMenus = async (): Promise<ApiResponse<Menu[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[Menu API] Fetching all menus from: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[Menu API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Menu API] Error fetching all menus:`, error);
    throw error;
  }
};

/**
 * 取得單個菜單詳情
 */
export const fetchMenuById = async (
  menuId: number
): Promise<ApiResponse<Menu>> => {
  const url = `${API_BASE_URL}${basePath}/${menuId}`;
  logJson(`[Menu API] Fetching menu by ID from: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[Menu API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Menu API] Error fetching menu by ID:`, error);
    throw error;
  }
};

/**
 * 新增菜單
 */
export const createMenus = async (
  menus: Menu[]
): Promise<ApiResponse<Menu[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[Menu API] Creating menus at: ${url}`);

  try {
    const response = await api.post(url, menus);
    logJson(`[Menu API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Menu API] Error creating menus:`, error);
    throw error;
  }
};

/**
 * 更新菜單
 */
export const updateMenu = async (
  menuId: number,
  menu: Menu
): Promise<ApiResponse<Menu>> => {
  const url = `${API_BASE_URL}${basePath}/${menuId}`;
  logJson(`[Menu API] Updating menu at: ${url}`);

  try {
    const response = await api.put(url, menu);
    logJson(`[Menu API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Menu API] Error updating menu:`, error);
    throw error;
  }
};

/**
 * 刪除菜單
 */
export const deleteMenu = async (
  menuId: number
): Promise<ApiResponse<void>> => {
  const url = `${API_BASE_URL}${basePath}/${menuId}`;
  logJson(`[Menu API] Deleting menu at: ${url}`);

  try {
    const response = await api.delete(url);
    logJson(`[Menu API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Menu API] Error deleting menu:`, error);
    throw error;
  }
};
