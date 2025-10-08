import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'dope_passcode';

export const encryptPasscode = (passcode) => {
  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET || 'dopesecret';
  return CryptoJS.AES.encrypt(passcode, secretKey).toString();
};

export const decryptPasscode = (encrypted) => {
  const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET || 'dopesecret';
  const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const storePasscode = (encrypted) => localStorage.setItem(STORAGE_KEY, encrypted);
export const getStoredPasscode = () => localStorage.getItem(STORAGE_KEY);
export const clearPasscode = () => localStorage.removeItem(STORAGE_KEY);
