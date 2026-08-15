
import { getPrisma } from '../../config/db.js';
import { parsePagination } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';


function publicCategorySummary(c) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    summary: c.summary,
    image: c.image,
    serviceCount: c._count?.services ?? undefined,
  };
}
function publicCategoryDetail(c) {
  return {
    ...publicCategorySummary(c),
    description: c.description,
    services: (c.services || []).map(publicServiceSummary),
  };
}
function publicServiceSummary(s) {
  return {
    id: s.id,
    name: s.name,
    slug: s.slug,
    category: s.categoryRef ? { id: s.categoryRef.id, name: s.categoryRef.name, slug: s.categoryRef.slug } : null,
    summary: s.summary,
    heroImage: s.heroImage,
    supportsEstimate: s.supportsEstimate,
  };
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
    description: p.publicDescription,
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

export async function listCategories() {
  const db = getPrisma();
  const rows = await db.serviceCategory.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { _count: { select: { services: { where: { isPublished: true } } } } },
  });
  return rows.map(publicCategorySummary);
}

export async function getCategoryBySlug(slug) {
  const db = getPrisma();
  const c = await db.serviceCategory.findFirst({
    where: { slug, isPublished: true },
    include: {
      services: { where: { isPublished: true }, orderBy: { sortOrder: 'asc' }, include: { categoryRef: true } },
    },
  });
  if (!c) throw new ApiError(httpStatus.NOT_FOUND, 'Category not found', 'CATEGORY_NOT_FOUND');
  return publicCategoryDetail(c);
}

export async function listServices(query = {}) {
  const db = getPrisma();
  const where = { isPublished: true };
  if (query?.categoryId) where.categoryId = query.categoryId;
  const slug = query?.category || query?.categorySlug;
  if (slug) where.categoryRef = { slug };
  if (query?.search) where.name = { contains: String(query.search).trim() };
  const rows = await db.service.findMany({
    where,
    orderBy: { sortOrder: 'asc' },
    include: { categoryRef: true },
  });
  return rows.map(publicServiceSummary);
}
export async function getServiceBySlug(slug) {
  const db = getPrisma();
  const s = await db.service.findFirst({
    where: { slug, isPublished: true },
    include: {
      categoryRef: true,
      rates: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
    },
  });
  if (!s) throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', 'SERVICE_NOT_FOUND');
  return publicServiceDetail(s);
}


export async function listProjects(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = { status: 'COMPLETED', isPublished: true };
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
    where: { id, status: 'COMPLETED', isPublished: true },
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


const CONTACT_TYPES = ['ENQUIRY', 'COMPLAINT', 'TESTIMONIAL'];

export async function listTestimonials() {
  const db = getPrisma();
  const rows = await db.contactMessage.findMany({
    where: { type: 'TESTIMONIAL', isPublished: true },
    orderBy: { createdAt: 'desc' },
    take: 6,
    select: { id: true, name: true, message: true },
  });
  return rows.map((t) => ({ id: t.id, name: t.name, message: t.message }));
}

export async function submitContact(body) {
  const name = body?.name?.trim();
  const message = body?.message?.trim();
  if (!name || !message) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'name and message are required', 'VALIDATION_ERROR');
  }
  const type = CONTACT_TYPES.includes(body?.type) ? body.type : 'ENQUIRY';
  const db = getPrisma();
  const created = await db.contactMessage.create({
    data: { type, name, email: body?.email ?? null, phone: body?.phone ?? null, subject: body?.subject ?? null, message },
  });


  
  if (created.email) {
    try {
      await db.notification.create({
        data: {
          recipientType: 'CONTACT',
          channel: 'EMAIL',
          templateType: 'contact_thankyou',
          payload: { name: created.name, email: created.email, type: created.type },
          status: 'QUEUED',
        },
      });
    } catch { /* ignore — submission already saved */ }
  }

  return { id: created.id, received: true };
}
