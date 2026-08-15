// Service Requests — public intake + instant estimate + admin triage.
import crypto from 'node:crypto';
import { getPrisma } from '../../config/db.js';
import { parsePagination } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const DEFAULT_TAX_PCT = 16; 

const REQUEST_TYPES = ['SERVICE', 'MACHINERY', 'LABOUR', 'ESTIMATE'];
const STATUSES = ['SUBMITTED', 'UNDER_REVIEW', 'QUOTED', 'ACCEPTED', 'REJECTED', 'CLOSED', 'CONVERTED'];


const SUPPORT_FIELD = {
  SERVICE: 'supportsServiceRequest',
  MACHINERY: 'supportsMachineryRequest',
  LABOUR: 'supportsLabourRequest',
  ESTIMATE: 'supportsEstimate',
};

async function generateReference(db) {
  const year = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    const reference = `REQ-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    if (!(await db.serviceRequest.findUnique({ where: { reference } }))) return reference;
  }
  return `REQ-${year}-${Date.now().toString(36).toUpperCase()}`;
}


export async function getEstimate(payload) {
  const serviceId = payload?.serviceId;
  const items = Array.isArray(payload?.items) ? payload.items : [];
  if (!serviceId) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'serviceId is required', 'VALIDATION_ERROR');
  }

  const db = getPrisma();
  const service = await db.service.findFirst({
    where: { id: serviceId, isPublished: true },
    include: { rates: { where: { isActive: true } } },
  });
  if (!service) throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', 'SERVICE_NOT_FOUND');

  const rateById = new Map(service.rates.map((r) => [r.id, r]));
  const lines = [];
  let subtotal = 0;

  for (const item of items) {
    const rate = rateById.get(item?.rateId);
    if (!rate) continue;
    let quantity = Number(item?.quantity) || 0;
    if (quantity < 0) quantity = 0;
    const min = rate.minQty != null ? Number(rate.minQty) : 0;
    if (quantity > 0 && min > 0 && quantity < min) quantity = min;
    const unitPrice = Number(rate.unitPrice);
    const lineTotal = round2(quantity * unitPrice);
    subtotal += lineTotal;
    lines.push({ rateId: rate.id, label: rate.label, unit: rate.unit, unitPrice, quantity, lineTotal });
  }

  subtotal = round2(subtotal);
  const taxRatePct = DEFAULT_TAX_PCT;
  const taxAmount = round2((subtotal * taxRatePct) / 100);
  const total = round2(subtotal + taxAmount);
  const margin = Number(service.estimateMarginPct ?? 10) / 100;

  return {
    currency: 'KES',
    service: { id: service.id, name: service.name, slug: service.slug },
    lines, subtotal, taxRatePct, taxAmount, total,
    range: { low: round2(total * (1 - margin)), high: round2(total * (1 + margin)) },
    note: 'Indicative estimate. Final pricing is confirmed after review.',
  };
}


export async function submit(payload) {
  const type = REQUEST_TYPES.includes(payload?.type) ? payload.type : 'SERVICE';
  const serviceId = payload?.serviceId;
  const contactName = payload?.contactName?.trim();
  const contactEmail = payload?.contactEmail?.trim() || null;
  const contactPhone = payload?.contactPhone?.trim() || null;

  if (!serviceId) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'serviceId is required', 'VALIDATION_ERROR');
  if (!contactName) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'contactName is required', 'VALIDATION_ERROR');
  if (!contactEmail && !contactPhone) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Provide an email or phone so we can respond', 'CONTACT_REQUIRED');
  }

  const db = getPrisma();
  const service = await db.service.findFirst({ where: { id: serviceId, isPublished: true } });
  if (!service) throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', 'SERVICE_NOT_FOUND');
  if (!service[SUPPORT_FIELD[type]]) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, `This service does not accept ${type.toLowerCase()} requests`, 'REQUEST_TYPE_UNSUPPORTED');
  }

  let requestedMachineryId = payload?.requestedMachineryId || null;
  if (requestedMachineryId && !(await db.machinery.findUnique({ where: { id: requestedMachineryId } }))) {
    requestedMachineryId = null;
  }

  const reference = await generateReference(db);
  const created = await db.serviceRequest.create({
    data: {
      reference,
      type,
      serviceId,
      contactName,
      contactEmail,
      contactPhone,
      description: payload?.description ?? null,
      location: payload?.location ?? null,
      requestedStart: payload?.requestedStart ? new Date(payload.requestedStart) : null,
      requestedEnd: payload?.requestedEnd ? new Date(payload.requestedEnd) : null,
      requestedMachineryId,
      requestedRole: payload?.requestedRole ?? null,
      requestedQuantity: payload?.requestedQuantity != null ? Number(payload.requestedQuantity) : null,
      metadata: payload?.metadata ?? undefined,
      status: 'SUBMITTED',
    },
  });


  return { id: created.id, reference: created.reference, status: created.status, service: { id: service.id, name: service.name } };
}


export async function getByReference(reference) {
  const db = getPrisma();
  const r = await db.serviceRequest.findUnique({ where: { reference }, include: { service: true } });
  if (!r) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found', 'REQUEST_NOT_FOUND');
  return {
    reference: r.reference,
    type: r.type,
    status: r.status,
    service: { name: r.service.name, slug: r.service.slug },
    submittedAt: r.createdAt,
  };
}


export async function list(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  if (query?.status) where.status = query.status;
  if (query?.type) where.type = query.type;
  if (query?.serviceId) where.serviceId = query.serviceId;

  const [items, total] = await Promise.all([
    db.serviceRequest.findMany({
      where, skip, take, orderBy: { createdAt: 'desc' },
      include: { service: { select: { name: true } } },
    }),
    db.serviceRequest.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getById(id) {
  const db = getPrisma();
  const r = await db.serviceRequest.findUnique({
    where: { id },
    include: { service: true, client: true, quotations: true, documents: true, requestedMachinery: true },
  });
  if (!r) throw new ApiError(httpStatus.NOT_FOUND, 'Request not found', 'REQUEST_NOT_FOUND');
  return r;
}

export async function updateStatus(id, status) {
  const db = getPrisma();
  if (!STATUSES.includes(status)) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid status', 'INVALID_STATUS');
  }
  if (!(await db.serviceRequest.findUnique({ where: { id } }))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Request not found', 'REQUEST_NOT_FOUND');
  }
  return db.serviceRequest.update({ where: { id }, data: { status } });
}
