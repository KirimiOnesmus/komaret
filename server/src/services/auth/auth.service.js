
import bcrypt from 'bcryptjs';
import { getPrisma } from '../../config/db.js';
import { config } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';
import { signAccessToken, issueRefreshToken, revokeAllForUser } from './token.service.js';

export function toPublicUser(u) {
  if (!u) return null;
  const { passwordHash, ...rest } = u;
  return rest;
}

export async function login(email, password) {
  const db = getPrisma();
  const user = await db.user.findUnique({ where: { email: String(email || '').toLowerCase() } });


  const hash = user?.passwordHash || '$2a$12$0000000000000000000000000000000000000000000000000000';
  const passwordOk = await bcrypt.compare(String(password || ''), hash);

  if (!user || !user.isActive || !passwordOk) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid email or password', 'INVALID_CREDENTIALS');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user.id);
  return { user: toPublicUser(user), accessToken, refreshToken };
}

export async function register(payload) {
  const db = getPrisma();
  const name = payload?.name?.trim();
  const email = payload?.email?.trim().toLowerCase();
  const password = payload?.password;
  const role = payload?.role === 'OWNER' ? 'OWNER' : 'ADMIN';

  if (!name || !email || !password) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'name, email and password are required', 'VALIDATION_ERROR');
  }
  if (String(password).length < 8) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Password must be at least 8 characters', 'WEAK_PASSWORD');
  }

  const exists = await db.user.findUnique({ where: { email } });
  if (exists) throw new ApiError(httpStatus.CONFLICT, 'Email already in use', 'EMAIL_TAKEN');

  const passwordHash = await bcrypt.hash(String(password), config.auth.bcryptRounds);
  const created = await db.user.create({
    data: { name, email, passwordHash, role, emailVerifiedAt: new Date() },
  });
  return { user: toPublicUser(created) };
}

export async function getCurrentUser(userId) {
  const db = getPrisma();
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated', 'AUTH_REQUIRED');
  return toPublicUser(user);
}

export async function changePassword(userId, currentPassword, newPassword) {
  const db = getPrisma();
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Not authenticated', 'AUTH_REQUIRED');

  const ok = await bcrypt.compare(String(currentPassword || ''), user.passwordHash);
  if (!ok) throw new ApiError(httpStatus.BAD_REQUEST, 'Current password is incorrect', 'INVALID_PASSWORD');
  if (String(newPassword || '').length < 8) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'New password must be at least 8 characters', 'WEAK_PASSWORD');
  }

  const passwordHash = await bcrypt.hash(String(newPassword), config.auth.bcryptRounds);
  await db.user.update({ where: { id: userId }, data: { passwordHash } });
 
  await revokeAllForUser(userId);
}


export async function verifyEmail() {
  throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Email verification is not available yet', 'NOT_IMPLEMENTED');
}
export async function requestPasswordReset() {
  // Intentionally a no-op for now; the controller always returns a generic 200.
}
export async function confirmPasswordReset() {
  throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Password reset is not available yet', 'NOT_IMPLEMENTED');
}
