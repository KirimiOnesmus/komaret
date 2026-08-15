
import { getPrisma } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

export async function list(query = {}) {
  const db = getPrisma();
  const where = {};
  if (query?.isPublished !== undefined) where.isPublished = query.isPublished === 'true' || query.isPublished === true;
  return db.serviceCategory.findMany({
    where,
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { services: true } } },
  });
}

export async function getById(id) {
  const db = getPrisma();
  const category = await db.serviceCategory.findUnique({
    where: { id },
    include: {
      services: { orderBy: { sortOrder: 'asc' }, select: { id: true, name: true, slug: true, isPublished: true } },
      _count: { select: { services: true } },
    },
  });
  if (!category) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found', 'CATEGORY_NOT_FOUND');
  return category;
}
