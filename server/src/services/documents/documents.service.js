
import fs from 'node:fs';
import path from 'node:path';
import { getPrisma } from '../../config/db.js';
import { parsePagination } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

const truthy = (v) => v === true || v === 'true';

export async function create(file, body, actor) {
  if (!file) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'file is required (multipart field "file")', 'FILE_REQUIRED');
  }
  try {
    const db = getPrisma();
    return await db.document.create({
      data: {
        filename: file.originalname,
        storedName: file.filename,
        path: file.path, 
        mimeType: file.mimetype,
        sizeBytes: file.size,
        category: body?.category ?? null,
        isPublic: truthy(body?.isPublic),
        projectId: body?.projectId || null,
        serviceRequestId: body?.serviceRequestId || null,
        quotationId: body?.quotationId || null,
        uploadedById: actor?.id ?? null,
      },
    });
  } catch (err) {
  
    await fs.promises.unlink(file.path).catch(() => {});
    throw err;
  }
}

export async function list(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  for (const k of ['projectId', 'serviceRequestId', 'quotationId', 'category']) {
    if (query?.[k]) where[k] = query[k];
  }
  if (query?.isPublic !== undefined) where.isPublic = truthy(query.isPublic);

  const [items, total] = await Promise.all([
    db.document.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
    db.document.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getById(id) {
  const db = getPrisma();
  const doc = await db.document.findUnique({ where: { id } });
  if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Document not found', 'DOCUMENT_NOT_FOUND');
  return doc;
}

export async function getFileStream(id) {
  const doc = await getById(id);
  const abs = path.resolve(doc.path);
  if (!fs.existsSync(abs)) throw new ApiError(httpStatus.NOT_FOUND, 'File missing on disk', 'FILE_MISSING');
  return { stream: fs.createReadStream(abs), filename: doc.filename, mimeType: doc.mimeType };
}

export async function remove(id) {
  const db = getPrisma();
  const doc = await db.document.findUnique({ where: { id } });
  if (!doc) throw new ApiError(httpStatus.NOT_FOUND, 'Document not found', 'DOCUMENT_NOT_FOUND');
  await db.document.delete({ where: { id } });
  await fs.promises.unlink(path.resolve(doc.path)).catch(() => {}); 
}
