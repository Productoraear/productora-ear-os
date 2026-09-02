export const sanitizeData = <T>(data: T): T => {
  // Implementación básica S-Class
  if (typeof data === 'string') {
    return data.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "") as unknown as T;
  }
  return data;
};