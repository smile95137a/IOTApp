import CryptoJS from 'react-native-crypto-js';
import Constants from 'expo-constants';

// 從 `expo.extra` 取得加密金鑰
const ENCRYPTION_KEY =
  Constants.expoConfig?.extra?.eas?.ENCRYPTION_KEY || 'default_secret_key';

/**
 * AES 加密
 * @param data 要加密的字串
 * @returns 加密後的字串 (Base64)
 */
export const encryptData = (data: string): string => {
  try {
    const encrypted = CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.log('加密失敗:', error);
    return '';
  }
};

/**
 * AES 解密
 * @param encryptedData 加密過的字串 (Base64)
 * @returns 解密後的原始字串
 */
export const decryptData = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.log('解密失敗:', error);
    return '';
  }
};
