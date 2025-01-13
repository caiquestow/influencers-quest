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
  const encryptedKey = encryptApiKey(apiKey);
  localStorage.setItem('ai_api_key', encryptedKey);
};

export const getApiKey = (): string => {
  const encryptedKey = localStorage.getItem('ai_api_key');
  if (!encryptedKey) return '';
  return decryptApiKey(encryptedKey);
};

export const hasApiKey = (): boolean => {
  return !!localStorage.getItem('ai_api_key');
};