import { api } from './ApiClient';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

const basePath = `/auth`;

export const loginUser = async (loginData: {
  type: string;
  email?: string;
  countryCode?: string;
  phone?: string;
  password: string;
}): Promise<ApiResponse<any>> => {
  const url = `${API_BASE_URL}${basePath}/login`;
  console.log(`[Login] Sending request to ${url}`);
  console.log(`[Login] Login Type: ${loginData.type}`);

  if (loginData.type === 'email') {
    console.log(`[Login] Email: ${loginData.email}`);
  } else if (loginData.type === 'phone') {
    console.log(`[Login] Phone: ${loginData.countryCode}${loginData.phone}`);
  }

  console.log(`[Login] Password: ${'*'.repeat(loginData.password.length)}`);

  try {
    const response = await api.post(url, loginData);
    console.log(`[Login] API Response from ${url}:`, response.data);

    return response.data;
  } catch (error) {
    console.error(`[Login] Error during request to ${url}:`, error);
    throw error;
  }
};
