import axios from 'axios';
import config from '../config/env';

const BASE_URL = config.apiBaseUrl;
const REQUEST_TIMEOUT_MS = 15000;

let accessToken = null;
let refreshPromise = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  accessToken = null;
}

const api = axios.create({
  baseURL: BASE_URL,
  timeout: REQUEST_TIMEOUT_MS,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
  },

  maxContentLength: 10 * 1024 * 1024,
  maxBodyLength: 10 * 1024 * 1024,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true, timeout: REQUEST_TIMEOUT_MS }
      )
      .then((res) => {
        const newToken = res.data?.accessToken;
        setAccessToken(newToken);
        return newToken;
      })
      .catch((err) => {
        clearAccessToken();
        throw err;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;

    if (status === 401 && !original._retry && !original.url?.includes('/auth/')) {
      original._retry = true;
      try {
        const newToken = await refreshAccessToken();
        if (newToken) {
          original.headers = {
            ...original.headers,
            Authorization: `Bearer ${newToken}`,
          };
          return api(original);
        }
      } catch {
        // Refresh failed 
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

function normalizeError(error) {
  const status = error.response?.status ?? 0;
  const serverMessage = error.response?.data?.message;
  const safeMessage =
    typeof serverMessage === 'string' && serverMessage.length < 300
      ? serverMessage
      : 'Something went wrong. Please try again.';

  return {
    status,
    message: status === 0 ? 'Network error. Please check your connection.' : safeMessage,
    code: error.response?.data?.code,
  };
}

export default api;
