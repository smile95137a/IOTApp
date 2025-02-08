import CryptoJS from 'crypto-js';
import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra || {}; // 確保不會是 `null`
const ENCRYPTION_KEY = extra.eas.ENCRYPTION_KEY || 'default_encryption_key';
const HASH_KEY = extra.eas.HASH_KEY || 'DEFAULT_HASH_START';
const HASH_VALUE = extra.eas.HASH_VALUE || 'DEFAULT_HASH_END';
const API_BASE_URL = extra.eas.API_BASE_URL || 'http://172.20.10.4:8081';

console.log('API Base URL:', API_BASE_URL);
console.log('Encryption Key:', ENCRYPTION_KEY);
console.log('Hash Key:', HASH_KEY);
console.log('Hash Value:', HASH_VALUE);

// 加密函數
export const encryptData = (data: string): string => {
  const dataWithHash = `${HASH_KEY}${data}${HASH_VALUE}`;
  return CryptoJS.AES.encrypt(dataWithHash, ENCRYPTION_KEY).toString();
};

// 解密函數
export const decryptData = (ciphertext: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (
      decryptedData.startsWith(HASH_KEY) &&
      decryptedData.endsWith(HASH_VALUE)
    ) {
      return decryptedData.replace(HASH_KEY, '').replace(HASH_VALUE, '');
    }
    throw new Error('無效的數據');
  } catch (error) {
    return '解密失敗';
  }
};
