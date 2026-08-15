
import crypto from 'node:crypto';
import { getPrisma } from '../../config/db.js';
import { config } from '../../config/env.js';
import { parsePagination } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';
import { computeInvoiceTotals } from './tax.js';
import { buildInvoicePdf, buildReceiptPdf } from './pdf.js';
import { sendEmail } from '../communications/providers/email.provider.js';

async function generateNumber(db) {
  const year = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    const number = `INV-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    if (!(await db.invoice.findUnique({ where: { number } }))) return number;
  }
  return `INV-${year}-${Date.now().toString(36).toUpperCase()}`;
}


function pdfShape(inv) {
  const byRate = {};
  for (const it of inv.items) {
    const k = Number(it.taxRatePct);
    byRate[k] = byRate[k] || { ratePct: k, net: 0, vat: 0 };
    byRate[k].net = Math.round((byRate[k].net + Number(it.lineNet)) * 100) / 100;
    byRate[k].vat = Math.round((byRate[k].vat + Number(it.lineVat)) * 100) / 100;
  }
  return { ...inv, vatBreakdown: Object.values(byRate) };
}

async function getFull(id) {
  const db = getPrisma();
  const inv = await db.invoice.findUnique({
    where: { id },
    include: { items: { orderBy: { sortOrder: 'asc' } }, client: true, payments: { orderBy: { paidAt: 'desc' } } },
  });
  if (!inv) throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found', 'INVOICE_NOT_FOUND');
  return inv;
}

export async function create(body, actor) {
  if (!body?.quotationId && !body?.clientId && (!Array.isArray(body?.items) || body.items.length === 0)) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Provide a quotationId, or a clientId with line items', 'VALIDATION_ERROR');
  }
  const db = getPrisma();
  let clientId = body?.clientId || null;
  let projectId = body?.projectId || null;
  const quotationId = body?.quotationId || null;
  let rawItems = Array.isArray(body?.items) ? body.items : [];

  if (quotationId) {
    const q = await db.quotation.findUnique({ where: { id: quotationId }, include: { items: true, project: true } });
    if (!q) throw new ApiError(httpStatus.NOT_FOUND, 'Quotation not found', 'QUOTATION_NOT_FOUND');
    clientId = clientId || q.clientId;
    projectId = projectId || q.project?.id || null;
    if (rawItems.length === 0) rawItems = q.items.map((i) => ({ description: i.description, unit: i.unit, quantity: i.quantity, unitPrice: i.unitPrice, taxCode: 'B' }));
  }

  if (!clientId) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'clientId (or quotationId) is required', 'VALIDATION_ERROR');
  if (rawItems.length === 0) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'At least one line item is required', 'VALIDATION_ERROR');
  if (!(await db.client.findUnique({ where: { id: clientId } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Client not found', 'CLIENT_NOT_FOUND');

  const totals = computeInvoiceTotals(rawItems);
  const number = await generateNumber(db);
  return db.invoice.create({
    data: {
      number, clientId, projectId, quotationId, currency: body?.currency || 'KES',
      status: 'DRAFT', subtotal: totals.subtotal, vatAmount: totals.vatAmount, total: totals.total,
      sellerPin: config.company.kraPin || null, buyerPin: body?.buyerPin || null,
      notes: body?.notes || null, createdById: actor?.id || null,
      items: { create: totals.lines },
    },
    include: { items: true },
  });
}

export async function list(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  for (const k of ['clientId', 'projectId', 'status']) if (query?.[k]) where[k] = query[k];
  const [items, total] = await Promise.all([
    db.invoice.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { client: { select: { name: true } } } }),
    db.invoice.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getById(id) {
  const inv = await getFull(id);
  const paid = inv.payments.reduce((s, p) => s + Number(p.amount), 0);
  return { ...pdfShape(inv), paid, balance: Math.round((Number(inv.total) - paid) * 100) / 100 };
}

export async function issue(id) {
  const db = getPrisma();
  const inv = await db.invoice.findUnique({ where: { id } });
  if (!inv) throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found', 'INVOICE_NOT_FOUND');
  if (inv.status !== 'DRAFT') throw new ApiError(httpStatus.CONFLICT, 'Only draft invoices can be issued', 'NOT_DRAFT');
  return db.invoice.update({ where: { id }, data: { status: 'ISSUED', issuedAt: new Date(), sellerPin: config.company.kraPin || inv.sellerPin }, include: { items: true } });
}

export async function update(id, body) {
  const db = getPrisma();
  if (!(await db.invoice.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found', 'INVOICE_NOT_FOUND');
  const data = {};
  for (const k of ['notes', 'buyerPin']) if (body?.[k] !== undefined) data[k] = body[k];
  return db.invoice.update({ where: { id }, data });
}

export async function remove(id) {
  const db = getPrisma();
  if (!(await db.invoice.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Invoice not found', 'INVOICE_NOT_FOUND');
  await db.invoice.delete({ where: { id } });
}

export async function invoicePdf(id) {
  const inv = await getFull(id);
  return { buffer: await buildInvoicePdf(pdfShape(inv)), filename: `${inv.number}.pdf` };
}

export async function receiptPdf(id) {
  const inv = await getFull(id);
  return { buffer: await buildReceiptPdf(pdfShape(inv), inv.payments), filename: `${inv.number}-receipt.pdf` };
}

export async function emailInvoice(id) {
  const inv = await getFull(id);
  if (!inv.client.email) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Client has no email address', 'NO_EMAIL');
  const buffer = await buildInvoicePdf(pdfShape(inv));
  await sendEmail({
    to: inv.client.email,
    subject: `Invoice ${inv.number} — ${config.company.name}`,
    text: `Dear ${inv.client.name},\n\nPlease find attached invoice ${inv.number} for ${inv.currency} ${Number(inv.total).toLocaleString()}.\n\nRegards,\n${config.company.name}`,
    attachments: [{ filename: `${inv.number}.pdf`, content: buffer }],
  });
  return { emailed: true, to: inv.client.email };
}
