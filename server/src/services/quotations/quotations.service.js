
import crypto from 'node:crypto';
import { getPrisma } from '../../config/db.js';
import { config } from '../../config/env.js';
import { parsePagination } from '../../utils/pagination.js';
import { renderQuotationPdf } from '../../utils/pdf/quotationPdf.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

const STATUSES = ['DRAFT', 'SENT', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CONVERTED'];
const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const num = (v) => Number(v) || 0;

async function generateNumber(db) {
  const year = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    const number = `QUO-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    if (!(await db.quotation.findUnique({ where: { number } }))) return number;
  }
  return `QUO-${year}-${Date.now().toString(36).toUpperCase()}`;
}


function computeTotals(items, { discountType, discountValue, taxRatePct }) {
  let subtotal = 0;
  const lines = (items || []).map((it, i) => {
    const quantity = num(it.quantity ?? 1);
    const unitPrice = num(it.unitPrice);
    const lineTotal = round2(quantity * unitPrice);
    subtotal += lineTotal;
    return { description: String(it.description || ''), unit: it.unit ? String(it.unit) : null, quantity, unitPrice, lineTotal, sortOrder: it.sortOrder ?? i };
  });
  subtotal = round2(subtotal);
  let discount = 0;
  if (discountType === 'PERCENT') discount = round2((subtotal * num(discountValue)) / 100);
  else if (discountType === 'FIXED') discount = round2(num(discountValue));
  if (discount > subtotal) discount = subtotal;
  const taxable = round2(subtotal - discount);
  const taxAmount = round2((taxable * num(taxRatePct)) / 100);
  const total = round2(taxable + taxAmount);
  return { lines, subtotal, taxAmount, total };
}


async function recompute(db, quotationId) {
  const q = await db.quotation.findUnique({ where: { id: quotationId }, include: { items: true } });
  const { subtotal, taxAmount, total } = computeTotals(q.items, { discountType: q.discountType, discountValue: q.discountValue, taxRatePct: q.taxRatePct });
  return db.quotation.update({ where: { id: quotationId }, data: { subtotal, taxAmount, total }, include: { items: { orderBy: { sortOrder: 'asc' } }, client: true, service: true } });
}

export async function list(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  if (query?.status) where.status = query.status;
  if (query?.clientId) where.clientId = query.clientId;
  if (query?.serviceId) where.serviceId = query.serviceId;
  const [items, total] = await Promise.all([
    db.quotation.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { client: { select: { name: true } }, service: { select: { name: true } } } }),
    db.quotation.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getById(id) {
  const db = getPrisma();
  const q = await db.quotation.findUnique({ where: { id }, include: { items: { orderBy: { sortOrder: 'asc' } }, client: true, service: true, serviceRequest: true } });
  if (!q) throw new ApiError(httpStatus.NOT_FOUND, 'Quotation not found', 'QUOTATION_NOT_FOUND');
  return q;
}

export async function create(body, actor) {
  const serviceId = body?.serviceId;
  const clientId = body?.clientId;
  if (!serviceId) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'serviceId is required', 'VALIDATION_ERROR');
  if (!clientId) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'clientId is required', 'VALIDATION_ERROR');

  const db = getPrisma();
  if (!(await db.service.findUnique({ where: { id: serviceId } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', 'SERVICE_NOT_FOUND');
  if (!(await db.client.findUnique({ where: { id: clientId } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Client not found', 'CLIENT_NOT_FOUND');

  const opts = { discountType: body?.discountType || 'NONE', discountValue: num(body?.discountValue), taxRatePct: body?.taxRatePct != null ? num(body.taxRatePct) : 16 };
  const { lines, subtotal, taxAmount, total } = computeTotals(body?.items || [], opts);
  const number = await generateNumber(db);

  return db.quotation.create({
    data: {
      number, serviceId, clientId,
      serviceRequestId: body?.serviceRequestId || null,
      status: 'DRAFT', currency: body?.currency || 'KES',
      discountType: opts.discountType, discountValue: opts.discountValue, taxRatePct: opts.taxRatePct,
      subtotal, taxAmount, total,
      notes: body?.notes ?? null, validUntil: body?.validUntil ? new Date(body.validUntil) : null,
      createdById: actor.id,
      items: { create: lines.map((l) => ({ description: l.description, unit: l.unit, quantity: l.quantity, unitPrice: l.unitPrice, lineTotal: l.lineTotal, sortOrder: l.sortOrder })) },
    },
    include: { items: { orderBy: { sortOrder: 'asc' } }, client: true, service: true },
  });
}

export async function createFromServiceRequest(serviceRequestId, actor) {
  const db = getPrisma();
  const req = await db.serviceRequest.findUnique({ where: { id: serviceRequestId } });
  if (!req) throw new ApiError(httpStatus.NOT_FOUND, 'Service request not found', 'REQUEST_NOT_FOUND');


  let clientId = req.clientId;
  if (!clientId) {
    const email = req.contactEmail || null;
    const whatsappPhone = req.contactPhone || null;
    const client = await db.client.create({ data: { name: req.contactName, email, whatsappPhone, preferredChannel: whatsappPhone ? 'WHATSAPP' : 'EMAIL' } });
    clientId = client.id;
    await db.serviceRequest.update({ where: { id: serviceRequestId }, data: { clientId } });
  }

  const number = await generateNumber(db);
  const quotation = await db.quotation.create({
    data: { number, serviceId: req.serviceId, clientId, serviceRequestId, status: 'DRAFT', currency: 'KES', taxRatePct: 16, createdById: actor.id },
    include: { items: true, client: true, service: true },
  });
  await db.serviceRequest.update({ where: { id: serviceRequestId }, data: { status: 'QUOTED' } });
  return quotation;
}

export async function update(id, body) {
  const db = getPrisma();
  const existing = await db.quotation.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Quotation not found', 'QUOTATION_NOT_FOUND');

  const data = {};
  for (const k of ['currency', 'notes', 'discountType', 'discountValue', 'taxRatePct']) {
    if (body?.[k] !== undefined) data[k] = body[k];
  }
  if (body?.validUntil !== undefined) data.validUntil = body.validUntil ? new Date(body.validUntil) : null;


  if (Array.isArray(body?.items)) {
    const { lines } = computeTotals(body.items, {
      discountType: body?.discountType ?? existing.discountType,
      discountValue: body?.discountValue ?? existing.discountValue,
      taxRatePct: body?.taxRatePct ?? existing.taxRatePct,
    });
    await db.quotationItem.deleteMany({ where: { quotationId: id } });
    await db.quotationItem.createMany({ data: lines.map((l) => ({ quotationId: id, description: l.description, unit: l.unit, quantity: l.quantity, unitPrice: l.unitPrice, lineTotal: l.lineTotal, sortOrder: l.sortOrder })) });
  }

  await db.quotation.update({ where: { id }, data });
  return recompute(db, id);
}

export async function updateStatus(id, status) {
  const db = getPrisma();
  if (!STATUSES.includes(status)) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid status', 'INVALID_STATUS');
  if (!(await db.quotation.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Quotation not found', 'QUOTATION_NOT_FOUND');
  return db.quotation.update({ where: { id }, data: { status } });
}

export async function remove(id) {
  const db = getPrisma();
  if (!(await db.quotation.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Quotation not found', 'QUOTATION_NOT_FOUND');
  await db.quotation.delete({ where: { id } });
}


export async function addItem(quotationId, body) {
  const description = body?.description?.trim();
  if (!description) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'description is required', 'VALIDATION_ERROR');
  const db = getPrisma();
  if (!(await db.quotation.findUnique({ where: { id: quotationId } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Quotation not found', 'QUOTATION_NOT_FOUND');
  const quantity = num(body.quantity ?? 1);
  const unitPrice = num(body.unitPrice);
  await db.quotationItem.create({ data: { quotationId, description, unit: body?.unit ?? null, quantity, unitPrice, lineTotal: round2(quantity * unitPrice), sortOrder: Number(body?.sortOrder) || 0 } });
  return recompute(db, quotationId);
}

export async function updateItem(itemId, body) {
  const db = getPrisma();
  const item = await db.quotationItem.findUnique({ where: { id: itemId } });
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found', 'ITEM_NOT_FOUND');
  const data = {};
  for (const k of ['description', 'unit', 'sortOrder']) if (body?.[k] !== undefined) data[k] = body[k];
  const quantity = body?.quantity !== undefined ? num(body.quantity) : num(item.quantity);
  const unitPrice = body?.unitPrice !== undefined ? num(body.unitPrice) : num(item.unitPrice);
  data.quantity = quantity; data.unitPrice = unitPrice; data.lineTotal = round2(quantity * unitPrice);
  await db.quotationItem.update({ where: { id: itemId }, data });
  return recompute(db, item.quotationId);
}

export async function removeItem(itemId) {
  const db = getPrisma();
  const item = await db.quotationItem.findUnique({ where: { id: itemId } });
  if (!item) throw new ApiError(httpStatus.NOT_FOUND, 'Item not found', 'ITEM_NOT_FOUND');
  await db.quotationItem.delete({ where: { id: itemId } });
  return recompute(db, item.quotationId);
}


export async function renderPdf(id) {
  const q = await getById(id);
  return { stream: renderQuotationPdf(q), filename: `${q.number}.pdf` };
}


export async function draftItems(body) {
  const description = body?.description?.trim();
  if (!description) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'description is required', 'VALIDATION_ERROR');
  if (!config.llm.apiKey) {
    throw new ApiError(httpStatus.NOT_IMPLEMENTED, 'AI drafting is not configured (set ANTHROPIC_API_KEY)', 'LLM_NOT_CONFIGURED');
  }

  const db = getPrisma();
  let rateHint = '';
  if (body?.serviceId) {
    const svc = await db.service.findUnique({ where: { id: body.serviceId }, include: { rates: { where: { isActive: true } } } });
    if (svc?.rates?.length) rateHint = 'Known unit rates (KES):\n' + svc.rates.map((r) => `- ${r.label} (${r.unit}): ${r.unitPrice}`).join('\n');
  }

  const prompt = `You are drafting a construction Bill of Quantities (BOQ) for a quotation in Kenya (currency KES).
Propose line items for the work described. Respond with ONLY a JSON array, no prose, each item exactly:
{"description": string, "unit": string, "quantity": number, "unitPrice": number}
${rateHint}
Work description: ${description}`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': config.llm.apiKey, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model: config.llm.model, max_tokens: 1500, messages: [{ role: 'user', content: prompt }] }),
  });
  if (!resp.ok) throw new ApiError(httpStatus.BAD_REQUEST, 'AI request failed', 'LLM_ERROR');
  const dataJson = await resp.json();
  const text = (dataJson.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();

  let items;
  try {
    items = JSON.parse(text.replace(/^```json/i, '').replace(/```$/, '').trim());
  } catch {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Could not parse the AI response', 'LLM_PARSE_ERROR');
  }
  if (!Array.isArray(items)) items = [];

  const norm = items.map((it) => {
    const quantity = num(it.quantity);
    const unitPrice = num(it.unitPrice);
    return { description: String(it.description || ''), unit: it.unit ? String(it.unit) : null, quantity, unitPrice, lineTotal: round2(quantity * unitPrice) };
  });
  return { items: norm, subtotal: round2(norm.reduce((s, i) => s + i.lineTotal, 0)), note: 'AI-drafted BOQ — review and edit before saving. Not a saved quotation.' };
}
