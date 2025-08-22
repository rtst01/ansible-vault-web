// Конфигурация API endpoints
const getApiBaseUrl = (): string => {
  // Всегда используем localhost для браузера
  // Docker контейнеры общаются через порты, а не имена сервисов
  return 'http://localhost:8000';
};

export const API_BASE_URL = getApiBaseUrl();

// API endpoints
export const API_ENDPOINTS = {
  ENCRYPT_TEXT: '/api/v1/encrypt/text',
  DECRYPT_TEXT: '/api/v1/decrypt/text',
  ENCRYPT_FILE: '/api/v1/encrypt/file',
  DECRYPT_FILE: '/api/v1/decrypt/file',
  HEALTH: '/health'
} as const;

// Полные URL для API
export const getApiUrl = (endpoint: string): string => {
  return `${API_BASE_URL}${endpoint}`;
};
