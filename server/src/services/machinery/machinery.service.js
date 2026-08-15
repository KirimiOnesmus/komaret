
import { getPrisma } from '../../config/db.js';
import { parsePagination } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

const STATUSES = ['AVAILABLE', 'RESERVED', 'HIRED', 'IN_USE', 'MAINTENANCE', 'UNAVAILABLE'];

export async function list(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  if (query?.status) where.status = query.status;
  if (query?.isPublic !== undefined) where.isPublic = query.isPublic === 'true' || query.isPublic === true;
  const [items, total] = await Promise.all([
    db.machinery.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
    db.machinery.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getById(id) {
  const db = getPrisma();
  const m = await db.machinery.findUnique({
    where: { id },
    include: { projectAssignments: { include: { project: { select: { code: true, name: true } } } } },
  });
  if (!m) throw new ApiError(httpStatus.NOT_FOUND, 'Machinery not found', 'MACHINERY_NOT_FOUND');
  return m;
}

export async function create(body) {
  const name = body?.name?.trim();
  if (!name) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'name is required', 'VALIDATION_ERROR');
  if (body?.status && !STATUSES.includes(body.status)) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid status', 'INVALID_STATUS');
  const db = getPrisma();
  return db.machinery.create({
    data: {
      name,
      type: body?.type ?? null,
      description: body?.description ?? null,
      hireRate: body?.hireRate ?? null,
      hireTerms: body?.hireTerms ?? null,
      status: body?.status ?? 'AVAILABLE',
      isPublic: body?.isPublic ?? true,
      imagePath: body?.imagePath ?? null,
    },
  });
}

export async function update(id, body) {
  const db = getPrisma();
  if (!(await db.machinery.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Machinery not found', 'MACHINERY_NOT_FOUND');
  if (body?.status && !STATUSES.includes(body.status)) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid status', 'INVALID_STATUS');
  const data = {};
  for (const k of ['name', 'type', 'description', 'hireRate', 'hireTerms', 'status', 'isPublic', 'imagePath']) {
    if (body?.[k] !== undefined) data[k] = body[k];
  }
  return db.machinery.update({ where: { id }, data });
}

export async function remove(id) {
  const db = getPrisma();
  if (!(await db.machinery.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Machinery not found', 'MACHINERY_NOT_FOUND');
  await db.machinery.delete({ where: { id } });
}
