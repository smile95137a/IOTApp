import { logJson } from '@/utils/logJsonUtils';
import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

export interface User {
  [key: string]: any;
}

const basePath = `/api/b/users`;

/**
 * 取得所有使用者
 */
export const fetchAllUsers = async (): Promise<ApiResponse<User[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[User API] Fetching all users from: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[User API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[User API] Error fetching all users:`, error);
    throw error;
  }
};

/**
 * 透過 ID 取得使用者
 */
export const fetchUserById = async (id: string): Promise<ApiResponse<User>> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  logJson(`[User API] Fetching user by ID: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[User API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[User API] Error fetching user by ID:`, error);
    throw error;
  }
};

/**
 * 查詢使用者
 */
export const queryUser = async (req: any): Promise<ApiResponse<User[]>> => {
  const url = `${API_BASE_URL}${basePath}/queryUser`;
  logJson(`[User API] Querying user: ${url}`, req);

  try {
    const response = await api.post(url, req);
    logJson(`[User API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[User API] Error querying user:`, error);
    throw error;
  }
};

/**
 * 創建使用者（需要管理員權限）
 */
export const createUser = async (req: any): Promise<ApiResponse<User>> => {
  const url = `${API_BASE_URL}${basePath}/createUser`;
  logJson(`[User API] Creating user: ${url}`, req);

  try {
    const response = await api.post(url, req);
    logJson(`[User API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[User API] Error creating user:`, error);
    throw error;
  }
};

/**
 * 更新使用者
 */
export const updateUser = async (req: any): Promise<ApiResponse<User>> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[User API] Updating user: ${url}`, req);

  try {
    const response = await api.put(url, req);
    logJson(`[User API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[User API] Error updating user:`, error);
    throw error;
  }
};

/**
 * 刪除使用者（需要管理員權限）
 */
export const deleteUser = async (id: string): Promise<ApiResponse<boolean>> => {
  const url = `${API_BASE_URL}${basePath}/${id}`;
  logJson(`[User API] Deleting user: ${url}`);

  try {
    const response = await api.delete(url);
    logJson(`[User API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[User API] Error deleting user:`, error);
    throw error;
  }
};

/**
 * 加入黑名單
 */
export const addUsersToBlacklist = async (
  userIds: number[]
): Promise<ApiResponse<string>> => {
  const url = `${API_BASE_URL}${basePath}/addBlackList`;
  logJson(`[User API] Adding users to blacklist: ${url}`, userIds);

  try {
    const response = await api.put(url, userIds);
    logJson(`[User API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[User API] Error adding users to blacklist:`, error);
    throw error;
  }
};

/**
 * 移除黑名單
 */
export const removeUsersFromBlacklist = async (
  userIds: number[]
): Promise<ApiResponse<string>> => {
  const url = `${API_BASE_URL}${basePath}/removeBlackList`;
  logJson(`[User API] Removing users from blacklist: ${url}`, userIds);

  try {
    const response = await api.put(url, userIds);
    logJson(`[User API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[User API] Error removing users from blacklist:`, error);
    throw error;
  }
};
