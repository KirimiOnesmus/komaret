
import { getPrisma } from '../../config/db.js';
import { parsePagination } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

const ROLES = ['SITE_MANAGER', 'FOREMAN', 'PLUMBER', 'ELECTRICIAN', 'MASON', 'CARPENTER', 'PAINTER', 'GENERAL', 'OTHER'];
const STATUSES = ['AVAILABLE', 'ASSIGNED', 'UNAVAILABLE', 'INACTIVE'];

export async function list(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  if (query?.role) where.role = query.role;
  if (query?.status) where.status = query.status;
  if (query?.isActive !== undefined) where.isActive = query.isActive === 'true' || query.isActive === true;
  const [items, total] = await Promise.all([
    db.labour.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
    db.labour.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getById(id) {
  const db = getPrisma();
  const l = await db.labour.findUnique({
    where: { id },
    include: { assignments: { include: { project: { select: { code: true, name: true } } } } },
  });
  if (!l) throw new ApiError(httpStatus.NOT_FOUND, 'Labour not found', 'LABOUR_NOT_FOUND');
  return l;
}

export async function create(body) {
  const name = body?.name?.trim();
  if (!name) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'name is required', 'VALIDATION_ERROR');
  const role = ROLES.includes(body?.role) ? body.role : 'OTHER';
  if (body?.status && !STATUSES.includes(body.status)) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid status', 'INVALID_STATUS');
  const db = getPrisma();
  return db.labour.create({
    data: {
      name, role,
      skill: body?.skill ?? null,
      phone: body?.phone ?? null,
      email: body?.email ?? null,
      internalRate: body?.internalRate ?? null,
      status: body?.status ?? 'AVAILABLE',
      notes: body?.notes ?? null,
      isActive: body?.isActive ?? true,
    },
  });
}

export async function update(id, body) {
  const db = getPrisma();
  if (!(await db.labour.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Labour not found', 'LABOUR_NOT_FOUND');
  if (body?.role && !ROLES.includes(body.role)) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid role', 'INVALID_ROLE');
  if (body?.status && !STATUSES.includes(body.status)) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid status', 'INVALID_STATUS');
  const data = {};
  for (const k of ['name', 'role', 'skill', 'phone', 'email', 'internalRate', 'status', 'notes', 'isActive']) {
    if (body?.[k] !== undefined) data[k] = body[k];
  }
  return db.labour.update({ where: { id }, data });
}

export async function remove(id) {
  const db = getPrisma();
  if (!(await db.labour.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Labour not found', 'LABOUR_NOT_FOUND');
  await db.labour.delete({ where: { id } });
}
