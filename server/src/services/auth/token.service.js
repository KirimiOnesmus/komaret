
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';
import { getPrisma } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

function publicUser(u) {
  if (!u) return null;
  const { passwordHash, ...rest } = u;
  return rest;
}

function hashToken(raw) {
  return crypto.createHash('sha256').update(raw).digest('hex');
}

export function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role },
    config.auth.accessSecret,
    { expiresIn: config.auth.accessTtl }
  );
}

export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, config.auth.accessSecret);
  } catch {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token', 'TOKEN_INVALID');
  }
}

export async function issueRefreshToken(userId) {
  const db = getPrisma();
  const raw = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + config.auth.refreshTtlMs);
  await db.refreshToken.create({ data: { userId, tokenHash: hashToken(raw), expiresAt } });
  return raw;
}

export async function rotateRefreshToken(rawToken) {
  const db = getPrisma();
  if (!rawToken) throw new ApiError(httpStatus.UNAUTHORIZED, 'Session expired', 'SESSION_EXPIRED');

  const existing = await db.refreshToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: { user: true },
  });

  if (!existing || existing.revokedAt || existing.expiresAt < new Date()) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Session expired', 'SESSION_EXPIRED');
  }
  if (!existing.user.isActive) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Account disabled', 'ACCOUNT_DISABLED');
  }


  await db.refreshToken.update({ where: { id: existing.id }, data: { revokedAt: new Date() } });
  const refreshToken = await issueRefreshToken(existing.user.id);
  const accessToken = signAccessToken(existing.user);
  return { accessToken, refreshToken, user: publicUser(existing.user) };
}

export async function revokeRefreshToken(rawToken) {
  if (!rawToken) return;
  const db = getPrisma();
  await db.refreshToken.updateMany({
    where: { tokenHash: hashToken(rawToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function revokeAllForUser(userId) {
  const db = getPrisma();
  await db.refreshToken.updateMany({ where: { userId, revokedAt: null }, data: { revokedAt: new Date() } });
}
