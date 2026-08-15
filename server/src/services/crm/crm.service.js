
import { getPrisma } from '../../config/db.js';
import { parsePagination } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

const LEAD_STATUSES = ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'];

export async function listLeads(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  if (query?.status) where.status = query.status;
  if (query?.serviceId) where.serviceId = query.serviceId;
  const [items, total] = await Promise.all([
    db.lead.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { service: { select: { name: true } } } }),
    db.lead.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getLead(id) {
  const db = getPrisma();
  const lead = await db.lead.findUnique({ where: { id }, include: { service: true, client: true, followUps: { orderBy: { createdAt: 'desc' } } } });
  if (!lead) throw new ApiError(httpStatus.NOT_FOUND, 'Lead not found', 'LEAD_NOT_FOUND');
  return lead;
}

export async function createLead(body) {
  const name = body?.name?.trim();
  if (!name) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'name is required', 'VALIDATION_ERROR');
  if (body?.status && !LEAD_STATUSES.includes(body.status)) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid status', 'INVALID_STATUS');
  const db = getPrisma();
  return db.lead.create({
    data: {
      name, email: body?.email ?? null, phone: body?.phone ?? null,
      source: body?.source ?? null, serviceId: body?.serviceId ?? null,
      status: body?.status ?? 'NEW', notes: body?.notes ?? null,
    },
  });
}

export async function updateLead(id, body) {
  const db = getPrisma();
  if (!(await db.lead.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Lead not found', 'LEAD_NOT_FOUND');
  if (body?.status && !LEAD_STATUSES.includes(body.status)) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid status', 'INVALID_STATUS');
  const data = {};
  for (const k of ['name', 'email', 'phone', 'source', 'serviceId', 'status', 'notes']) {
    if (body?.[k] !== undefined) data[k] = body[k];
  }
  return db.lead.update({ where: { id }, data });
}

export async function removeLead(id) {
  const db = getPrisma();
  if (!(await db.lead.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Lead not found', 'LEAD_NOT_FOUND');
  await db.lead.delete({ where: { id } });
}


export async function convertLead(id) {
  const db = getPrisma();
  return db.$transaction(async (tx) => {
    const lead = await tx.lead.findUnique({ where: { id } });
    if (!lead) throw new ApiError(httpStatus.NOT_FOUND, 'Lead not found', 'LEAD_NOT_FOUND');
    if (lead.clientId) throw new ApiError(httpStatus.CONFLICT, 'Lead already converted', 'ALREADY_CONVERTED');
    if (!lead.email && !lead.phone) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Lead needs an email or phone to convert', 'CONTACT_REQUIRED');

    const client = await tx.client.create({
      data: {
        name: lead.name, email: lead.email, whatsappPhone: lead.phone,
        preferredChannel: lead.phone ? 'WHATSAPP' : 'EMAIL',
      },
    });
    await tx.lead.update({ where: { id }, data: { status: 'CONVERTED', clientId: client.id } });
    return client;
  });
}


export async function listClients(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  if (query?.q) where.OR = [{ name: { contains: query.q } }, { companyName: { contains: query.q } }, { email: { contains: query.q } }];
  const [items, total] = await Promise.all([
    db.client.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: { _count: { select: { projects: true, quotations: true } } } }),
    db.client.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getClient(id) {
  const db = getPrisma();
  const client = await db.client.findUnique({
    where: { id },
    include: {
      projects: { select: { id: true, code: true, name: true, status: true } },
      quotations: { select: { id: true, number: true, status: true, total: true } },
      serviceRequests: { select: { id: true, reference: true, status: true } },
      followUps: { orderBy: { createdAt: 'desc' } },
    },
  });
  if (!client) throw new ApiError(httpStatus.NOT_FOUND, 'Client not found', 'CLIENT_NOT_FOUND');
  return client;
}

export async function createClient(body) {
  const name = body?.name?.trim();
  const email = body?.email?.trim() || null;
  const whatsappPhone = body?.whatsappPhone?.trim() || body?.phone?.trim() || null;
  if (!name) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'name is required', 'VALIDATION_ERROR');
  if (!email && !whatsappPhone) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'A client needs an email or WhatsApp phone', 'CONTACT_REQUIRED');

  const db = getPrisma();
  let preferredChannel = body?.preferredChannel;
  if (preferredChannel !== 'EMAIL' && preferredChannel !== 'WHATSAPP') preferredChannel = whatsappPhone ? 'WHATSAPP' : 'EMAIL';
  return db.client.create({
    data: { name, email, whatsappPhone, preferredChannel, companyName: body?.companyName ?? null, address: body?.address ?? null },
  });
}

export async function updateClient(id, body) {
  const db = getPrisma();
  const existing = await db.client.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Client not found', 'CLIENT_NOT_FOUND');
  const data = {};
  for (const k of ['name', 'companyName', 'email', 'whatsappPhone', 'address', 'preferredChannel']) {
    if (body?.[k] !== undefined) data[k] = body[k];
  }

  const email = data.email !== undefined ? data.email : existing.email;
  const wa = data.whatsappPhone !== undefined ? data.whatsappPhone : existing.whatsappPhone;
  if (!email && !wa) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'A client needs an email or WhatsApp phone', 'CONTACT_REQUIRED');
  return db.client.update({ where: { id }, data });
}

export async function removeClient(id) {
  const db = getPrisma();
  if (!(await db.client.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Client not found', 'CLIENT_NOT_FOUND');
  try {
    await db.client.delete({ where: { id } });
  } catch (err) {
    if (err?.code === 'P2003') throw new ApiError(httpStatus.CONFLICT, 'Client has related projects/quotations and cannot be deleted', 'CLIENT_IN_USE');
    throw err;
  }
}


export async function listFollowUps(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  if (query?.done !== undefined) where.done = query.done === 'true' || query.done === true;
  if (query?.leadId) where.leadId = query.leadId;
  if (query?.clientId) where.clientId = query.clientId;
  const [items, total] = await Promise.all([
    db.followUp.findMany({ where, skip, take, orderBy: [{ done: 'asc' }, { dueDate: 'asc' }] }),
    db.followUp.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function createFollowUp(body, actor) {
  const note = body?.note?.trim();
  if (!note) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'note is required', 'VALIDATION_ERROR');
  if (!body?.leadId && !body?.clientId) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'A follow-up must reference a lead or a client', 'TARGET_REQUIRED');
  const db = getPrisma();
  return db.followUp.create({
    data: {
      note, leadId: body?.leadId ?? null, clientId: body?.clientId ?? null,
      dueDate: body?.dueDate ? new Date(body.dueDate) : null,
      done: body?.done ?? false, createdById: actor?.id ?? null,
    },
  });
}

export async function updateFollowUp(id, body) {
  const db = getPrisma();
  if (!(await db.followUp.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Follow-up not found', 'FOLLOWUP_NOT_FOUND');
  const data = {};
  if (body?.note !== undefined) data.note = body.note;
  if (body?.done !== undefined) data.done = body.done;
  if (body?.dueDate !== undefined) data.dueDate = body.dueDate ? new Date(body.dueDate) : null;
  return db.followUp.update({ where: { id }, data });
}

export async function removeFollowUp(id) {
  const db = getPrisma();
  if (!(await db.followUp.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Follow-up not found', 'FOLLOWUP_NOT_FOUND');
  await db.followUp.delete({ where: { id } });
}
