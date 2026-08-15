
import { ApiError } from '../utils/ApiError.js';
import httpStatus from '../utils/httpStatus.js';

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required', 'AUTH_REQUIRED'));
    }
    if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
      return next(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions', 'FORBIDDEN'));
    }
    next();
  };
}
