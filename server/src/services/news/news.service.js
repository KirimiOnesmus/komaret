
import { getPrisma } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../../config/env.js';


export const NEWS_CATEGORY_LABELS = Object.freeze({
  COMPANY_UPDATES: 'Company Updates',
  INDUSTRY_INSIGHTS: 'Industry Insights',
});
const VALID_CATEGORIES = new Set(Object.keys(NEWS_CATEGORY_LABELS));

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeCategory(value, fallback = 'COMPANY_UPDATES') {
  if (value === undefined || value === null || value === '') return fallback;
  const key = String(value).toUpperCase().replace(/[\s-]+/g, '_');
  if (!VALID_CATEGORIES.has(key)) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid news category', 'INVALID_CATEGORY');
  }
  return key;
}

function unlinkImageIfLocal(storedUrl) {
  if (storedUrl && storedUrl.startsWith(config.uploads.imagesPublicPath)) {
    const name = storedUrl.slice(config.uploads.imagesPublicPath.length + 1);
    try { fs.unlinkSync(path.join(config.uploads.imagesDir, name)); } catch { /* ignore */ }
  }
}

export async function list(query = {}) {
  const db = getPrisma();
  const where = {};
  if (query?.category) where.category = normalizeCategory(query.category);
  if (query?.isPublished !== undefined) where.isPublished = String(query.isPublished) === 'true';
  if (query?.search) where.title = { contains: String(query.search).trim() };
  return db.article.findMany({ where, orderBy: [{ createdAt: 'desc' }] });
}

export async function getById(id) {
  const db = getPrisma();
  const article = await db.article.findUnique({ where: { id } });
  if (!article) throw new ApiError(httpStatus.NOT_FOUND, 'Article not found', 'ARTICLE_NOT_FOUND');
  return article;
}

export async function create(body) {
  const db = getPrisma();
  const title = body?.title?.trim();
  if (!title) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'title is required', 'VALIDATION_ERROR');
  const articleBody = body?.body?.trim();
  if (!articleBody) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'body is required', 'VALIDATION_ERROR');

  let slug = body?.slug?.trim() || slugify(title);
  if (!slug) slug = `article-${Date.now().toString(36)}`;
  if (await db.article.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;

  const isPublished = body?.isPublished ?? false;
  return db.article.create({
    data: {
      title,
      slug,
      excerpt: body?.excerpt?.trim() || null,
      body: articleBody,
      category: normalizeCategory(body?.category),
      image: body?.image ?? null,
      isPublished,
      publishedAt: isPublished ? new Date() : null,
    },
  });
}

export async function update(id, body) {
  const db = getPrisma();
  const existing = await getById(id);

  const data = {};
  if (body?.title !== undefined) {
    const title = body.title.trim();
    if (!title) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'title cannot be empty', 'VALIDATION_ERROR');
    data.title = title;
  }
  if (body?.body !== undefined) {
    const articleBody = body.body.trim();
    if (!articleBody) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'body cannot be empty', 'VALIDATION_ERROR');
    data.body = articleBody;
  }
  if (body?.excerpt !== undefined) data.excerpt = body.excerpt?.trim() || null;
  if (body?.category !== undefined) data.category = normalizeCategory(body.category);
  if (body?.slug !== undefined && body.slug.trim()) {
    let slug = slugify(body.slug);
    const clash = await db.article.findUnique({ where: { slug } });
    if (clash && clash.id !== id) slug = `${slug}-${Date.now().toString(36)}`;
    data.slug = slug;
  }
  if (body?.isPublished !== undefined) {
    data.isPublished = !!body.isPublished;
   
    if (data.isPublished && !existing.publishedAt) data.publishedAt = new Date();
    if (!data.isPublished) data.publishedAt = null;
  }

  return db.article.update({ where: { id }, data });
}

export async function remove(id) {
  const db = getPrisma();
  const existing = await getById(id);
  if (existing.image) unlinkImageIfLocal(existing.image);
  await db.article.delete({ where: { id } });
}

export async function setImage(id, file) {
  if (!file) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'An image file is required', 'IMAGE_REQUIRED');
  const db = getPrisma();
  const existing = await db.article.findUnique({ where: { id } });
  if (!existing) {
    try { fs.unlinkSync(file.path); } catch { /* ignore */ }
    throw new ApiError(httpStatus.NOT_FOUND, 'Article not found', 'ARTICLE_NOT_FOUND');
  }
  const publicPath = `${config.uploads.imagesPublicPath}/${file.filename}`;
  const updated = await db.article.update({ where: { id }, data: { image: publicPath } });
  unlinkImageIfLocal(existing.image);
  return updated;
}

export async function removeImage(id) {
  const db = getPrisma();
  const existing = await db.article.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Article not found', 'ARTICLE_NOT_FOUND');
  if (existing.image) unlinkImageIfLocal(existing.image);
  return db.article.update({ where: { id }, data: { image: null } });
}
