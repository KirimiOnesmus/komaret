import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { config } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import httpStatus from '../utils/httpStatus.js';

const IMAGE_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp']);

fs.mkdirSync(config.uploads.imagesDir, { recursive: true });

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, config.uploads.imagesDir),
  filename: (req, file, cb) => {
    const id = crypto.randomBytes(16).toString('hex');
    cb(null, `${id}${path.extname(file.originalname).toLowerCase()}`);
  },
});

export const imageUpload = multer({
  storage: imageStorage,
  limits: { fileSize: config.uploads.maxBytes },
  fileFilter: (req, file, cb) => {
    if (!IMAGE_TYPES.has(file.mimetype)) {
      return cb(new ApiError(httpStatus.UNSUPPORTED_MEDIA_TYPE, 'Only PNG, JPEG or WebP images are allowed', 'BAD_IMAGE_TYPE'));
    }
    cb(null, true);
  },
});