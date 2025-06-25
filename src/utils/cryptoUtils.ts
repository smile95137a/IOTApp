import CryptoJS from 'react-native-crypto-js';
import Constants from 'expo-constants';

const ENCRYPTION_KEY =
  Constants.expoConfig?.extra?.eas?.ENCRYPTION_KEY || 'default_secret_key';

/**
 * 加密物件資料
 * @param obj 要加密的物件
 * @returns 加密後的字串 (Base64)
 */
export const encryptObject = (obj: Record<string, any>): string => {
  try {
    const jsonString = JSON.stringify(obj); // 物件轉字串
    const encrypted = CryptoJS.AES.encrypt(
      jsonString,
      ENCRYPTION_KEY
    ).toString();
    return encrypted;
  } catch (error: any) {
    console.log('加密失敗:', error);
    return '';
  }
};

/**
 * 解密為物件
 * @param encryptedData 加密字串 (Base64)
 * @returns 解密後的物件（若失敗則回傳 null）
 */
export const decryptObject = (
  encryptedData: string
): Record<string, any> | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedString);
  } catch (error: any) {
    console.log('解密失敗:', error);
    return null;
  }
};
