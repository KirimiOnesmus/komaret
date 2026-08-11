import api, { setAccessToken, clearAccessToken } from './api';


const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    setAccessToken(data.accessToken);
    return data.user;
  },

  async register(payload) {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  async verifyEmail(token) {
    const { data } = await api.post('/auth/verify-email', { token });
    return data;
  },

  async requestPasswordReset(email) {
    const { data } = await api.post('/auth/password-reset/request', { email });
    return data;
  },

  async resetPassword(token, newPassword) {
    const { data } = await api.post('/auth/password-reset/confirm', {
      token,
      newPassword,
    });
    return data;
  },

  async changePassword(currentPassword, newPassword) {
    const { data } = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return data;
  },

  async getCurrentUser() {
    const { data } = await api.get('/auth/me');
    return data.user;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      clearAccessToken();
    }
  },

  async refresh() {
    const { data } = await api.post('/auth/refresh');
    setAccessToken(data.accessToken);
    return data;
  },
};

export default authService;
