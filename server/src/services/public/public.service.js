
import { getPrisma } from '../../config/db.js';
import { parsePagination } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';


function publicServiceSummary(s) {
  return { id: s.id, name: s.name, slug: s.slug, category: s.category, summary: s.summary, heroImage: s.heroImage, supportsEstimate: s.supportsEstimate };
}
function publicServiceDetail(s) {
  return {
    ...publicServiceSummary(s),
    description: s.description,
    supports: {
      serviceRequest: s.supportsServiceRequest,
      machineryRequest: s.supportsMachineryRequest,
      labourRequest: s.supportsLabourRequest,
      estimate: s.supportsEstimate,
    },
    rates: (s.rates || []).map((r) => ({ id: r.id, label: r.label, unit: r.unit, unitPrice: r.unitPrice, minQty: r.minQty, defaultQty: r.defaultQty })),
  };
}
function publicProject(p) {
  return {
    id: p.id,
    name: p.name,
    service: p.service ? { name: p.service.name, slug: p.service.slug } : null,
    location: p.location,
    summary: p.publicSummary,         
    completedAt: p.actualEndDate,
    images: (p.images || []).map((im) => ({ path: im.path, caption: im.caption, isCover: im.isCover })),
   
  };
}
function publicMachinery(m) {
  return {
    id: m.id,
    name: m.name,
    type: m.type,
    description: m.description,
    hireRate: m.hireRate,
    hireTerms: m.hireTerms,
    imagePath: m.imagePath,
    available: m.status === 'AVAILABLE', 
  };
}

export async function listServices() {
  const db = getPrisma();
  const rows = await db.service.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } });
  return rows.map(publicServiceSummary);
}
export async function getServiceBySlug(slug) {
  const db = getPrisma();
  const s = await db.service.findFirst({
    where: { slug, isPublished: true },
    include: { rates: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } } },
  });
  if (!s) throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', 'SERVICE_NOT_FOUND');
  return publicServiceDetail(s);
}


export async function listProjects(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = { status: 'COMPLETED' };
  if (query?.serviceId) where.serviceId = query.serviceId;

  const [rows, total] = await Promise.all([
    db.project.findMany({
      where, skip, take, orderBy: { actualEndDate: 'desc' },
      include: {
        service: { select: { name: true, slug: true } },
        images: { where: { showcase: true }, orderBy: { sortOrder: 'asc' } },
      },
    }),
    db.project.count({ where }),
  ]);
  return { items: rows.map(publicProject), meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getProjectById(id) {
  const db = getPrisma();
  const p = await db.project.findFirst({
    where: { id, status: 'COMPLETED' }, 
    include: {
      service: { select: { name: true, slug: true } },
      images: { where: { showcase: true }, orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!p) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found', 'PROJECT_NOT_FOUND');
  return publicProject(p);
}


export async function listMachinery(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = { isPublic: true };

  const [rows, total] = await Promise.all([
    db.machinery.findMany({ where, skip, take, orderBy: { name: 'asc' } }),
    db.machinery.count({ where }),
  ]);
  return { items: rows.map(publicMachinery), meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getMachineryById(id) {
  const db = getPrisma();
  const m = await db.machinery.findFirst({ where: { id, isPublic: true } });
  if (!m) throw new ApiError(httpStatus.NOT_FOUND, 'Machinery not found', 'MACHINERY_NOT_FOUND');
  return publicMachinery(m);
}


export async function submitContact(body) {
  const name = body?.name?.trim();
  const message = body?.message?.trim();
  if (!name || !message) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'name and message are required', 'VALIDATION_ERROR');
  }
  const db = getPrisma();
  const created = await db.contactMessage.create({
    data: { name, email: body?.email ?? null, phone: body?.phone ?? null, subject: body?.subject ?? null, message },
  });
  return { id: created.id, received: true };
}
