
import { ApiError } from '../utils/ApiError.js';
import httpStatus from '../utils/httpStatus.js';

export function validate(schema, property = 'body') {
  return (req, res, next) => {
    if (!schema) return next(); // stub schema — skip until implemented
    try {
    
      next();
    } catch (err) {
      next(new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Validation failed', 'VALIDATION_ERROR'));
    }
  };
}
