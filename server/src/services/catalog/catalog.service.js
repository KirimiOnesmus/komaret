
import { getPrisma } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../../config/env.js';

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}


export async function list(query = {}) {
  const db = getPrisma();
  const where = {};
  if (query?.categoryId) where.categoryId = query.categoryId;
  return db.service.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { rates: true } }, categoryRef: { select: { id: true, name: true, slug: true } } },
  });
}

export async function getById(id) {
  const db = getPrisma();
  const service = await db.service.findUnique({
    where: { id },
    include: { rates: { orderBy: { sortOrder: 'asc' } }, categoryRef: { select: { id: true, name: true, slug: true } } },
  });
  if (!service) throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', 'SERVICE_NOT_FOUND');
  return service;
}

export async function create(body) {
  const db = getPrisma();
  const name = body?.name?.trim();
  if (!name) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'name is required', 'VALIDATION_ERROR');

  let slug = body?.slug?.trim() || slugify(name);
  if (await db.service.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;

  return db.service.create({
    data: {
      name,
      slug,
      category: body?.category ?? null,
      categoryId: body?.categoryId ?? null,
      summary: body?.summary ?? null,
      description: body?.description ?? null,
      heroImage: body?.heroImage ?? null,
      isPublished: body?.isPublished ?? true,
      sortOrder: Number(body?.sortOrder) || 0,
      supportsServiceRequest: body?.supportsServiceRequest ?? true,
      supportsMachineryRequest: body?.supportsMachineryRequest ?? false,
      supportsLabourRequest: body?.supportsLabourRequest ?? false,
      supportsEstimate: body?.supportsEstimate ?? false,
      estimateMarginPct: body?.estimateMarginPct ?? 10,
    },
  });
}

export async function update(id, body) {
  const db = getPrisma();
  await getById(id); 
  const data = {};
  for (const k of ['name', 'category', 'categoryId', 'summary', 'description', 'heroImage', 'isPublished',
    'sortOrder', 'supportsServiceRequest', 'supportsMachineryRequest', 'supportsLabourRequest',
    'supportsEstimate', 'estimateMarginPct']) {
    if (body?.[k] !== undefined) data[k] = body[k];
  }
  if (body?.slug !== undefined) data.slug = slugify(body.slug);
  return db.service.update({ where: { id }, data });
}

export async function remove(id) {
  const db = getPrisma();
  await getById(id);
  await db.service.delete({ where: { id } });
}


export async function listRates(serviceId) {
  const db = getPrisma();
  return db.serviceRate.findMany({ where: { serviceId }, orderBy: { sortOrder: 'asc' } });
}

export async function addRate(serviceId, body) {
  const db = getPrisma();
  await getById(serviceId);
  const label = body?.label?.trim();
  const unit = body?.unit?.trim();
  if (!label || !unit || body?.unitPrice == null) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'label, unit and unitPrice are required', 'VALIDATION_ERROR');
  }
  return db.serviceRate.create({
    data: {
      serviceId,
      label,
      unit,
      unitPrice: body.unitPrice,
      minQty: body?.minQty ?? null,
      defaultQty: body?.defaultQty ?? null,
      isActive: body?.isActive ?? true,
      sortOrder: Number(body?.sortOrder) || 0,
    },
  });
}

export async function updateRate(rateId, body) {
  const db = getPrisma();
  const existing = await db.serviceRate.findUnique({ where: { id: rateId } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Rate not found', 'RATE_NOT_FOUND');
  const data = {};
  for (const k of ['label', 'unit', 'unitPrice', 'minQty', 'defaultQty', 'isActive', 'sortOrder']) {
    if (body?.[k] !== undefined) data[k] = body[k];
  }
  return db.serviceRate.update({ where: { id: rateId }, data });
}

export async function removeRate(rateId) {
  const db = getPrisma();
  const existing = await db.serviceRate.findUnique({ where: { id: rateId } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Rate not found', 'RATE_NOT_FOUND');
  await db.serviceRate.delete({ where: { id: rateId } });
}



function unlinkImageIfLocal(storedUrl) {
  if (storedUrl && storedUrl.startsWith(config.uploads.imagesPublicPath)) {
    const name = storedUrl.slice(config.uploads.imagesPublicPath.length + 1);
    try { fs.unlinkSync(path.join(config.uploads.imagesDir, name)); } catch { /* ignore */ }
  }
}

export async function setImage(id, file) {
  if (!file) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'An image file is required', 'IMAGE_REQUIRED');
  const db = getPrisma();
  const existing = await db.service.findUnique({ where: { id } });
  if (!existing) {
    try { fs.unlinkSync(file.path); } catch { /* ignore */ }
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', 'SERVICE_NOT_FOUND');
  }
  const publicPath = `${config.uploads.imagesPublicPath}/${file.filename}`;
  const updated = await db.service.update({ where: { id }, data: { heroImage: publicPath } });
  unlinkImageIfLocal(existing.heroImage);
  return updated;
}

export async function removeImage(id) {
  const db = getPrisma();
  const existing = await db.service.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', 'SERVICE_NOT_FOUND');
  if (existing.heroImage) unlinkImageIfLocal(existing.heroImage);
  return db.service.update({ where: { id }, data: { heroImage: null } });
}
