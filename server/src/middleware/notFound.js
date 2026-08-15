import { ApiError } from '../utils/ApiError.js';
import httpStatus from '../utils/httpStatus.js';

export function notFound(req, res, next) {
  next(new ApiError(httpStatus.NOT_FOUND, `Route not found: ${req.method} ${req.originalUrl}`, 'NOT_FOUND'));
}
