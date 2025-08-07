export const getErrorMessage = (error, fallback = '發生未知錯誤') => {
  if (!error) return fallback;

  return (
    error?.response?.data?.message ||
    error?.message ||
    String(error) ||
    fallback
  );
};
