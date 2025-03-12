import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas?.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/api/b/monitor`;

/**
 * 新增監視器
 */
export const createMonitor = async (monitorReq) => {
  const url = `${API_BASE_URL}${basePath}/create`;
  console.log(`[Monitor API] Creating new monitor: ${url}`, monitorReq);

  try {
    const response = await api.post(url, monitorReq);
    console.log(`[Monitor API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[Monitor API] Error creating monitor:`, error);
    throw error;
  }
};

/**
 * 更新監視器
 */
export const updateMonitor = async (monitorUpdateReq) => {
  const url = `${API_BASE_URL}${basePath}/update`;
  console.log(`[Monitor API] Updating monitor: ${url}`, monitorUpdateReq);

  try {
    const response = await api.put(url, monitorUpdateReq);
    console.log(`[Monitor API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[Monitor API] Error updating monitor:`, error);
    throw error;
  }
};

/**
 * 取得某商店的所有監視器
 */
export const getMonitorsByStoreId = async (storeUid) => {
  const url = `${API_BASE_URL}${basePath}/store/${storeUid}`;
  console.log(`[Monitor API] Fetching monitors for store: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[Monitor API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[Monitor API] Error fetching monitors for store:`, error);
    throw error;
  }
};

/**
 * 刪除監視器
 */
export const deleteMonitor = async (id) => {
  const url = `${API_BASE_URL}${basePath}/delete/${id}`;
  console.log(`[Monitor API] Deleting monitor: ${url}`);

  try {
    const response = await api.delete(url);
    console.log(`[Monitor API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`[Monitor API] Error deleting monitor:`, error);
    throw error;
  }
};
