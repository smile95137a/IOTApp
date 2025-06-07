import { api } from './FrontendAPI';

const basePath = '/game';

/**
 * 開始遊戲
 */
export const startGame = async (gameReq: any) => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/start`,
      gameReq
    );
    return response.data;
  } catch (error) {
    console.error('[Game API] startGame error:', error);
    throw error;
  }
};

/**
 * 結帳遊戲
 */
export const checkoutGame = async (checkoutReq: any) => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/checkout`,
      checkoutReq
    );
    return response.data;
  } catch (error) {
    console.error('[Game API] checkoutGame error:', error);
    throw error;
  }
};

/**
 * 查詢可預約時間
 */
export const getAvailableTimes = async (
  storeId: number,
  bookingDate: string,
  poolTableId: number
) => {
  try {
    const response = await api.get<ApiResponse<any>>(
      `${basePath}/available-times`,
      {
        params: { storeId, bookingDate, poolTableId },
      }
    );
    return response.data;
  } catch (error) {
    console.error('[Game API] getAvailableTimes error:', error);
    throw error;
  }
};

/**
 * 預約遊戲
 */
export const bookGame = async (bookReq: any) => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/book`,
      bookReq
    );
    return response.data;
  } catch (error) {
    console.error('[Game API] bookGame error:', error);
    throw error;
  }
};

/**
 * 取消預約
 */
export const cancelBook = async (cancelReq: any) => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/cancel`,
      cancelReq
    );
    return response.data;
  } catch (error) {
    console.error('[Game API] cancelBook error:', error);
    throw error;
  }
};

/**
 * 預約開台
 */
export const bookStart = async (bookStartReq: any) => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/bookStart`,
      bookStartReq
    );
    return response.data;
  } catch (error) {
    console.error('[Game API] bookStart error:', error);
    throw error;
  }
};

/**
 * 查詢預約清單
 */
export const getBookGameList = async () => {
  try {
    const response = await api.get<ApiResponse<any[]>>(
      `${basePath}/getBookGame`
    );
    return response.data;
  } catch (error) {
    console.error('[Game API] getBookGame error:', error);
    throw error;
  }
};

/**
 * 查詢遊戲價格
 */
export const getGamePrice = async (gameReq: any) => {
  try {
    const response = await api.post<ApiResponse<any>>(
      `${basePath}/getGamePrice`,
      gameReq
    );
    return response.data;
  } catch (error) {
    console.error('[Game API] getGamePrice error:', error);
    throw error;
  }
};

/**
 * 查詢是否可用
 */
export const checkIsUse = async () => {
  try {
    const response = await api.get<ApiResponse<any>>(`${basePath}/isUse`);
    return response.data;
  } catch (error) {
    console.error('[Game API] checkIsUse error:', error);
    throw error;
  }
};
