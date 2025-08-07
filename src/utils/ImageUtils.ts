const API_IMAGE_URL = import.meta.env.VITE_BASE_API_URL;

export const getImageUrl = (imagePath: string): string => {
  return `${API_IMAGE_URL}${imagePath}`;
};
