import { asyncHandler } from '../utils/asyncHandler.js';
import { config } from '../config/env.js';
import * as authService from '../services/auth/auth.service.js';
import * as tokenService from '../services/auth/token.service.js';

const REFRESH_COOKIE = 'refreshToken';

function setRefreshCookie(res, token) {

  const crossSite = config.auth.crossSiteCookies;
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: config.isProduction || crossSite,
    sameSite: crossSite ? 'none' : 'strict',
    path: '/api/v1/auth',
    maxAge: config.auth.refreshTtlMs,
  });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);
  setRefreshCookie(res, refreshToken);
  res.json({ accessToken, user });
});

export const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const result = await authService.verifyEmail(req.body.token);
  res.json(result);
});

export const requestPasswordReset = asyncHandler(async (req, res) => {
  await authService.requestPasswordReset(req.body.email);
  res.json({ message: 'If the account exists, a reset link has been sent.' });
});

export const confirmPasswordReset = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await authService.confirmPasswordReset(token, newPassword);
  res.json(result);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user.id, currentPassword, newPassword);
  res.json({ message: 'Password changed.' });
});

export const me = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  res.json({ user });
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  const { accessToken, refreshToken, user } = await tokenService.rotateRefreshToken(token);
  setRefreshCookie(res, refreshToken);
  res.json({ accessToken, user });
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) await tokenService.revokeRefreshToken(token);
  res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
  res.status(204).end();
});