import { logJson } from '@/utils/logJsonUtils';
import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/api/b/roles`;

// 1. 獲取所有角色
export const fetchAllRoles = async (): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[Role API] Fetching all roles from: ${url}`);

  try {
    const response = await api.get(url);
    console.log(`[Role API] Response:`, response.data);
    return response.data;
  } catch (error) {
    console.log(`[Role API] Error fetching roles:`, error);
    throw error;
  }
};

// 2. 獲取單個角色（包含菜單）
export const fetchRoleById = async (roleId: number): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${roleId}`;
  console.log(`[Role API] Fetching role by ID: ${url}`);

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.log(`[Role API] Error fetching role by ID:`, error);
    throw error;
  }
};

// 3. 創建新角色
export const createRole = async (role: any): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}`;
  console.log(`[Role API] Creating role:`, role);

  try {
    const response = await api.post(url, role);
    return response.data;
  } catch (error) {
    console.log(`[Role API] Error creating role:`, error);
    throw error;
  }
};

// 4. 更新角色
export const updateRole = async (roleId: number, role: any): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${roleId}`;
  console.log(`[Role API] Updating role:`, role);

  try {
    const response = await api.put(url, role);
    return response.data;
  } catch (error) {
    console.log(`[Role API] Error updating role:`, error);
    throw error;
  }
};

// 5. 刪除角色
export const deleteRole = async (roleId: number): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${roleId}`;
  console.log(`[Role API] Deleting role: ${url}`);

  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    console.log(`[Role API] Error deleting role:`, error);
    throw error;
  }
};

// 6. 設置角色的菜單權限
export const assignMenusToRole = async (
  roleId: number,
  menuIds: number[]
): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${roleId}/menus`;
  console.log(`[Role API] Assigning menus to role:`, { roleId, menuIds });

  try {
    const response = await api.post(url, { menuIds });
    return response.data;
  } catch (error) {
    console.log(`[Role API] Error assigning menus to role:`, error);
    throw error;
  }
};

// 7. 獲取角色的菜單權限
export const fetchMenusByRole = async (roleId: number): Promise<any> => {
  const url = `${API_BASE_URL}${basePath}/${roleId}/menus`;
  console.log(`[Role API] Fetching menus by role: ${url}`);

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.log(`[Role API] Error fetching menus by role:`, error);
    throw error;
  }
};
