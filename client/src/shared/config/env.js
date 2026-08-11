
export const config = Object.freeze({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  env: import.meta.env.MODE || 'development',
  isProduction: import.meta.env.MODE === 'production',
});

export default config;
