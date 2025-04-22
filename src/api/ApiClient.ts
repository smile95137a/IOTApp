import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logJson } from '@/utils/logJsonUtils';
import { handleUnauthorizedLogout } from '@/utils/authUtils';

export const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    console.log(`[API Request] Authorization: Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.data);
    return response;
  },
  async (error) => {
    const status = error.response?.status;
    console.log(
      `[API Error] ${error.config?.url}:`,
      error.response?.data || error.message
    );

    if (status === 401) {
      await handleUnauthorizedLogout();
    }

    return Promise.reject(error);
  }
);
