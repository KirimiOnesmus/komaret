import { asyncHandler } from "../../utils/asyncHandler.js";
import * as service from "../services/documents/documents.service.js";

export const list = asyncHandler(async (req, res) =>
  res.json(await service.list(req.query)),
);
export const getById = asyncHandler(async (req, res) =>
  res.json(await service.getById(req.params.id)),
);
export const create = asyncHandler(async (req, res) =>
  res.status(201).json(await service.create(req.file, req.body, req.user)),
);
export const download = asyncHandler(async (req, res) => {
  const { stream, filename, mimeType } = await service.getFileStream(
    req.params.id,
    req.user,
  );
  res.setHeader("Content-Type", mimeType);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  stream.pipe(res);
});
export const remove = asyncHandler(async (req, res) => {
  await service.remove(req.params.id, req.user);
  res.status(204).end();
});
