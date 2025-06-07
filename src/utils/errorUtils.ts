export const getErrorMessage = (error: any): string => {
  if (!error) return '系統發生錯誤，請稍後再試';

  if (error.isAutoLogout) return '';

  const backendMessage = error?.response?.data?.message;
  if (typeof backendMessage === 'string' && backendMessage.trim() !== '') {
    return backendMessage;
  }

  if (typeof error?.message === 'string' && error.message.trim() !== '') {
    return error.message;
  }

  if (typeof error?.status === 'number') {
    switch (error.status) {
      case 401:
        return '登入已過期，請重新登入';
      case 403:
        return '您沒有權限執行此操作';
      case 500:
        return '伺服器發生錯誤，請稍後再試';
    }
  }

  return '系統發生錯誤，請稍後再試';
};
