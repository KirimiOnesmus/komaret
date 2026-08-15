
import { config } from '../config/env.js';
import { logger } from '../config/logger.js';
import httpStatus from '../utils/httpStatus.js';

export function errorHandler(err, req, res, next) {
  const status = err.status || httpStatus.INTERNAL_SERVER_ERROR;
  const isServerError = status >= 500;

  if (isServerError) logger.error(err);

  const message = isServerError && config.isProduction
    ? 'Something went wrong. Please try again.'
    : err.message;

  res.status(status).json({
    status,
    message,
    code: err.code || (isServerError ? 'INTERNAL_ERROR' : 'ERROR'),
    ...(config.isProduction ? {} : { stack: err.stack }),
  });
}
