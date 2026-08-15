import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

export async function list(/* query */) {
  throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Not implemented', 'NOT_IMPLEMENTED');
}
export async function getById(/* id */) {
  throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Not implemented', 'NOT_IMPLEMENTED');
}
export async function create(/* payload, actor */) {
  throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Not implemented', 'NOT_IMPLEMENTED');
}
export async function update(/* id, payload, actor */) {
  throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Not implemented', 'NOT_IMPLEMENTED');
}
export async function remove(/* id, actor */) {
  throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'Not implemented', 'NOT_IMPLEMENTED');
}
