import { api } from './FrontendAPI';

const basePath = '/auth';

export const loginUser = async (loginData: {
  type: string;
  email?: string;
  countryCode?: string;
  phone?: string;
  password: string;
}): Promise<ApiResponse<any>> => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/login`,
      loginData
    );
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};
