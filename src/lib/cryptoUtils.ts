// src/lib/cryptoUtils.ts

export const encryptApiKey = (apiKey: string): string => {
  // Este é apenas um exemplo básico usando btoa
  return btoa(apiKey);
};

export const decryptApiKey = (encryptedKey: string): string => {
  try {
    return atob(encryptedKey);
  } catch {
    return '';
  }
};

export const saveApiKey = (apiKey: string) => {
  if (typeof window !== 'undefined') {
    const encryptedKey = encryptApiKey(apiKey);
    window.localStorage.setItem('ai_api_key', encryptedKey);
  }
};

export const getApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const encryptedKey = window.localStorage.getItem('ai_api_key');
    if (!encryptedKey) return '';
    return decryptApiKey(encryptedKey);
  }
  return '';
};

export const hasApiKey = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!window.localStorage.getItem('ai_api_key');
  }
  return false;
};