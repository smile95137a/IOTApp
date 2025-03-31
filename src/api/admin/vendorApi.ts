import { api } from '../ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

export interface Vendor {
  [key: string]: any;
}

const basePath = `/api/b/vendors`;

export const fetchAllVendors = async (): Promise<ApiResponse<Vendor[]>> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[Vendor API] Fetching all vendors from: ${url}`);

  try {
    const response = await api.get(url);
    logJson(`[Vendor API] Response:`, response.data);
    return response.data;
  } catch (error) {
    logJson(`[Vendor API] Error fetching all vendors:`, error);
    throw error;
  }
};

export const fetchVendorById = async (
  uid: string
): Promise<ApiResponse<Vendor>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  logJson(`[Vendor API] Fetching vendor with ID: ${uid}`);

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    logJson(`[Vendor API] Error fetching vendor:`, error);
    throw error;
  }
};

export const createVendor = async (
  vendor: Partial<Vendor>
): Promise<ApiResponse<Vendor>> => {
  const url = `${API_BASE_URL}${basePath}`;
  logJson(`[Vendor API] Creating vendor:`, vendor);

  try {
    const response = await api.post(url, vendor);
    return response.data;
  } catch (error) {
    logJson(`[Vendor API] Error creating vendor:`, error);
    throw error;
  }
};

export const updateVendor = async (
  uid: string,
  vendor: Partial<Vendor>
): Promise<ApiResponse<Vendor>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  logJson(`[Vendor API] Updating vendor:`, vendor);

  try {
    const response = await api.put(url, vendor);
    return response.data;
  } catch (error) {
    logJson(`[Vendor API] Error updating vendor:`, error);
    throw error;
  }
};

export const deleteVendor = async (uid: string): Promise<ApiResponse<void>> => {
  const url = `${API_BASE_URL}${basePath}/${uid}`;
  logJson(`[Vendor API] Deleting vendor with ID: ${uid}`);

  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    logJson(`[Vendor API] Error deleting vendor:`, error);
    throw error;
  }
};

// Store API Calls
export const fetchStoresByVendor = async (
  vendorId: number
): Promise<ApiResponse<Store[]>> => {
  const url = `${API_BASE_URL}${basePath}/${vendorId}/stores`;
  logJson(`[Vendor API] Fetching stores for vendor ID: ${vendorId}`);

  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    logJson(`[Vendor API] Error fetching stores:`, error);
    throw error;
  }
};

export const addStoreToVendor = async (
  vendorId: number,
  store: Partial<Store>
): Promise<ApiResponse<Store>> => {
  const url = `${API_BASE_URL}${basePath}/${vendorId}/stores`;
  logJson(`[Vendor API] Adding store to vendor:`, store);

  try {
    const response = await api.post(url, store);
    return response.data;
  } catch (error) {
    logJson(`[Vendor API] Error adding store:`, error);
    throw error;
  }
};

export const updateStoreVendor = async (
  storeId: number,
  vendorId: number
): Promise<ApiResponse<Store>> => {
  const url = `${API_BASE_URL}${basePath}/${storeId}/vendor/${vendorId}`;
  logJson(
    `[Vendor API] Updating store vendor relation: store ${storeId} -> vendor ${vendorId}`
  );

  try {
    const response = await api.put(url);
    return response.data;
  } catch (error) {
    logJson(`[Vendor API] Error updating store vendor:`, error);
    throw error;
  }
};

export const deleteStore = async (
  storeId: number
): Promise<ApiResponse<void>> => {
  const url = `${API_BASE_URL}${basePath}/${storeId}`;
  logJson(`[Vendor API] Deleting store ID: ${storeId}`);

  try {
    const response = await api.delete(url);
    return response.data;
  } catch (error) {
    logJson(`[Vendor API] Error deleting store:`, error);
    throw error;
  }
};
