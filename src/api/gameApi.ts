// GameApi.ts
import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {};
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/game`;

export const startGame = async (gameReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/start`;
  console.log('[Game API] Starting game:', gameReq);
  try {
    const response = await api.post(url, gameReq);
    console.log('[Game API] Game started successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Game API] Error starting game:', error);
    throw error;
  }
};

export const endGame = async (gameReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/end`;
  console.log('[Game API] Ending game:', gameReq);
  try {
    const response = await api.post(url, gameReq);
    console.log('[Game API] Game ended successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Game API] Error ending game:', error);
    throw error;
  }
};

export const checkout = async (checkoutReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/checkout`;
  console.log('[Game API] Checkout request:', checkoutReq);
  try {
    const response = await api.post(url, checkoutReq);
    console.log('[Game API] Checkout successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Game API] Checkout failed:', error);
    throw error;
  }
};

export const getAvailableTimes = async (
  storeId: number,
  bookingDate: string
): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/available-times?storeId=${storeId}&bookingDate=${bookingDate}`;
  console.log('[Game API] Fetching available times:', storeId, bookingDate);
  try {
    const response = await api.get(url);
    console.log('[Game API] Available times received:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Game API] Error fetching available times:', error);
    throw error;
  }
};

export const bookGame = async (gameReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/book`;
  console.log('[Game API] Booking game:', gameReq);
  try {
    const response = await api.post(url, gameReq);
    console.log('[Game API] Game booked successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Game API] Error booking game:', error);
    throw error;
  }
};

export const cancelBook = async (gameReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/cancel`;
  console.log('[Game API] Cancelling booking:', gameReq);
  try {
    const response = await api.post(url, gameReq);
    console.log('[Game API] Booking cancelled successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Game API] Error cancelling booking:', error);
    throw error;
  }
};

export const bookStart = async (gameReq: any): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/bookStart`;
  console.log('[Game API] Starting booked game:', gameReq);
  try {
    const response = await api.post(url, gameReq);
    console.log('[Game API] Booked game started:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Game API] Error starting booked game:', error);
    throw error;
  }
};
