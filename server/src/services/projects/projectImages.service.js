
import fs from 'node:fs';
import path from 'node:path';
import { getPrisma } from '../../config/db.js';
import { config } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

const PUBLIC = config.uploads.imagesPublicPath;

async function ensureProject(db, projectId) {
  const p = await db.project.findUnique({ where: { id: projectId } });
  if (!p) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found', 'PROJECT_NOT_FOUND');
  return p;
}

function rowFrom(file, extra) {
  return {
    filename: file.originalname,
    storedName: file.filename,
    path: `${PUBLIC}/${file.filename}`,
    mimeType: file.mimetype,
    sizeBytes: file.size,
    ...extra,
  };
}

export async function listImages(projectId) {
  const db = getPrisma();
  await ensureProject(db, projectId);
  return db.projectImage.findMany({
    where: { projectId },
    orderBy: [{ isCover: 'desc' }, { sortOrder: 'asc' }],
  });
}

// Add one or more showcase (gallery) images.
export async function addImages(projectId, files) {
  const db = getPrisma();
  await ensureProject(db, projectId);
  if (!files?.length) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'No images uploaded', 'NO_FILES');

  const start = await db.projectImage.count({ where: { projectId } });
  const created = [];
  for (let i = 0; i < files.length; i++) {
    created.push(
      await db.projectImage.create({
        data: { projectId, ...rowFrom(files[i], { showcase: true, isCover: false, sortOrder: start + i }) },
      })
    );
  }
  return created;
}

// Upload a NEW cover image (the "avatar"); unsets any previous cover.
export async function setCover(projectId, file) {
  const db = getPrisma();
  await ensureProject(db, projectId);
  if (!file) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'No image uploaded', 'NO_FILE');

  return db.$transaction(async (tx) => {
    await tx.projectImage.updateMany({ where: { projectId, isCover: true }, data: { isCover: false } });
    return tx.projectImage.create({
      data: { projectId, ...rowFrom(file, { showcase: true, isCover: true, sortOrder: 0 }) },
    });
  });
}

// Update caption / sortOrder / showcase, or promote an existing image to cover.
export async function updateImage(projectId, imageId, body) {
  const db = getPrisma();
  const img = await db.projectImage.findFirst({ where: { id: imageId, projectId } });
  if (!img) throw new ApiError(httpStatus.NOT_FOUND, 'Image not found', 'IMAGE_NOT_FOUND');

  if (body?.isCover === true) {
    return db.$transaction(async (tx) => {
      await tx.projectImage.updateMany({ where: { projectId, isCover: true }, data: { isCover: false } });
      return tx.projectImage.update({ where: { id: imageId }, data: { isCover: true } });
    });
  }

  const data = {};
  if (body?.caption !== undefined) data.caption = body.caption;
  if (body?.showcase !== undefined) data.showcase = Boolean(body.showcase);
  if (body?.sortOrder !== undefined) data.sortOrder = Number(body.sortOrder) || 0;
  if (body?.isCover === false) data.isCover = false;
  return db.projectImage.update({ where: { id: imageId }, data });
}

export async function removeImage(projectId, imageId) {
  const db = getPrisma();
  const img = await db.projectImage.findFirst({ where: { id: imageId, projectId } });
  if (!img) throw new ApiError(httpStatus.NOT_FOUND, 'Image not found', 'IMAGE_NOT_FOUND');

  await db.projectImage.delete({ where: { id: imageId } });
  // Best-effort file cleanup — a missing file must not fail the request.
  fs.promises.unlink(path.join(config.uploads.imagesDir, img.storedName)).catch(() => {});
  return { deleted: true };
}