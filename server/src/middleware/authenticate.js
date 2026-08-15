
import { verifyAccessToken } from '../services/auth/token.service.js';
import { ApiError } from '../utils/ApiError.js';
import httpStatus from '../utils/httpStatus.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required', 'AUTH_REQUIRED'));
  }
  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    next(err);
  }
}
