
import crypto from 'node:crypto';
import { getPrisma } from '../../config/db.js';
import { parsePagination } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

const PROJECT_STATUSES = ['PENDING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];


async function queueClientProgress(db, project, message, progressPct) {
  const c = await db.client.findUnique({ where: { id: project.clientId } });
  if (!c) return;
  const has = { WHATSAPP: !!c.whatsappPhone, EMAIL: !!c.email };
  let channel = c.preferredChannel;
  if (!has[channel]) channel = has.EMAIL ? 'EMAIL' : (has.WHATSAPP ? 'WHATSAPP' : null);
  if (!channel) return;
  await db.notification.create({
    data: {
      recipientType: 'CLIENT', clientId: c.id, channel,
      templateType: 'project_progress',
      payload: { projectId: project.id, projectCode: project.code, projectName: project.name, message, progressPct: progressPct ?? null },
      status: 'QUEUED', projectId: project.id,
    },
  });
}


async function generateCode(db) {
  const year = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    const code = `PRJ-${year}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
    if (!(await db.project.findUnique({ where: { code } }))) return code;
  }
  return `PRJ-${year}-${Date.now().toString(36).toUpperCase()}`;
}

async function resolveClient(tx, { clientId, client, fromRequest, fromQuotation }) {
  if (clientId) {
    const c = await tx.client.findUnique({ where: { id: clientId } });
    if (!c) throw new ApiError(httpStatus.NOT_FOUND, 'Client not found', 'CLIENT_NOT_FOUND');
    return c;
  }
  if (fromQuotation?.clientId) return tx.client.findUnique({ where: { id: fromQuotation.clientId } });
  if (fromRequest?.clientId) {
    const linked = await tx.client.findUnique({ where: { id: fromRequest.clientId } });
    if (linked) return linked;
  }

  const src = client || (fromRequest
    ? { name: fromRequest.contactName, email: fromRequest.contactEmail, whatsappPhone: fromRequest.contactPhone }
    : null);
  if (!src?.name) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'A client is required (clientId or client details)', 'CLIENT_REQUIRED');
  }
  const email = src.email?.trim() || null;
  const whatsappPhone = src.whatsappPhone?.trim() || src.phone?.trim() || null;
  if (!email && !whatsappPhone) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Client needs an email or WhatsApp phone', 'CONTACT_REQUIRED');
  }
  return tx.client.create({
    data: {
      name: src.name.trim(), email, whatsappPhone,
      companyName: src.companyName ?? null, address: src.address ?? null,
      preferredChannel: whatsappPhone ? 'WHATSAPP' : 'EMAIL',
    },
  });
}

export async function create(body, actor) {
  const name = body?.name?.trim();
  if (!name) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'name is required', 'VALIDATION_ERROR');

  const db = getPrisma();
  const serviceRequestId = body?.serviceRequestId || null;
  const quotationId = body?.quotationId || null;

  return db.$transaction(async (tx) => {
    let fromRequest = null;
    let fromQuotation = null;

    if (serviceRequestId) {
      fromRequest = await tx.serviceRequest.findUnique({ where: { id: serviceRequestId }, include: { project: true } });
      if (!fromRequest) throw new ApiError(httpStatus.NOT_FOUND, 'Service request not found', 'REQUEST_NOT_FOUND');
      if (fromRequest.project) throw new ApiError(httpStatus.CONFLICT, 'That request already has a project', 'ALREADY_CONVERTED');
    }
    if (quotationId) {
      fromQuotation = await tx.quotation.findUnique({ where: { id: quotationId }, include: { project: true } });
      if (!fromQuotation) throw new ApiError(httpStatus.NOT_FOUND, 'Quotation not found', 'QUOTATION_NOT_FOUND');
      if (fromQuotation.project) throw new ApiError(httpStatus.CONFLICT, 'That quotation already has a project', 'ALREADY_CONVERTED');
    }

  
    const serviceId = body?.serviceId || fromQuotation?.serviceId || fromRequest?.serviceId;
    if (!serviceId) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'serviceId is required', 'VALIDATION_ERROR');
    const service = await tx.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new ApiError(httpStatus.NOT_FOUND, 'Service not found', 'SERVICE_NOT_FOUND');

    const client = await resolveClient(tx, { clientId: body?.clientId, client: body?.client, fromRequest, fromQuotation });

    const code = await generateCode(tx);
    const status = PROJECT_STATUSES.includes(body?.status) ? body.status : 'PENDING';

    const project = await tx.project.create({
      data: {
        code, name, serviceId, clientId: client.id,
        serviceRequestId, quotationId, status,
        budget: body?.budget ?? null,
        location: body?.location ?? null,
        description: body?.description ?? null,
        publicSummary: body?.publicSummary ?? null,
        progressPct: Number(body?.progressPct) || 0,
        startDate: body?.startDate ? new Date(body.startDate) : null,
        expectedEndDate: body?.expectedEndDate ? new Date(body.expectedEndDate) : null,
        createdById: actor.id,
      },
    });

    if (fromRequest) {
      await tx.serviceRequest.update({ where: { id: serviceRequestId }, data: { status: 'CONVERTED', clientId: client.id } });
    }
    if (fromQuotation) {
      await tx.quotation.update({ where: { id: quotationId }, data: { status: 'CONVERTED' } });
    }

    await tx.projectActivity.create({
      data: {
        projectId: project.id, type: 'EVENT', title: 'Project created',
        detail: fromRequest ? `From request ${fromRequest.reference}`
          : fromQuotation ? `From quotation ${fromQuotation.number}`
          : 'Created from dashboard',
        isPublic: false, createdById: actor.id,
      },
    });

    return project;
  });
}

export async function list(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  if (query?.status) where.status = query.status;
  if (query?.serviceId) where.serviceId = query.serviceId;
  if (query?.clientId) where.clientId = query.clientId;

  const [items, total] = await Promise.all([
    db.project.findMany({
      where, skip, take, orderBy: { createdAt: 'desc' },
      include: {
        service: { select: { name: true } },
        client: { select: { name: true } },
        _count: { select: { machinery: true, labour: true } },
      },
    }),
    db.project.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function getById(id) {
  const db = getPrisma();
  const p = await db.project.findUnique({
    where: { id },
    include: {
      service: true, client: true, quotation: true, serviceRequest: true,
      machinery: { include: { machinery: true } },
      labour: { include: { labour: true } },
      images: { orderBy: { sortOrder: 'asc' } },
      activities: { orderBy: { createdAt: 'desc' }, take: 50 },
      documents: true,
    },
  });
  if (!p) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found', 'PROJECT_NOT_FOUND');
  return p;
}

export async function update(id, body, actor) {
  const db = getPrisma();
  const existing = await db.project.findUnique({ where: { id } });
  if (!existing) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found', 'PROJECT_NOT_FOUND');

  const data = {};
  for (const k of ['name', 'location', 'description', 'publicSummary', 'budget']) {
    if (body?.[k] !== undefined) data[k] = body[k];
  }
  if (body?.status !== undefined) {
    if (!PROJECT_STATUSES.includes(body.status)) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Invalid status', 'INVALID_STATUS');
    data.status = body.status;
    if (body.status === 'COMPLETED' && !existing.actualEndDate) data.actualEndDate = new Date();
  }
  if (body?.progressPct !== undefined) {
    let p = Number(body.progressPct);
    if (Number.isNaN(p)) p = existing.progressPct;
    data.progressPct = Math.max(0, Math.min(100, p));
  }
  for (const k of ['startDate', 'expectedEndDate', 'actualEndDate']) {
    if (body?.[k] !== undefined) data[k] = body[k] ? new Date(body[k]) : null;
  }

  const updated = await db.project.update({ where: { id }, data });

  const changes = [];
  if (data.status && data.status !== existing.status) changes.push(`status → ${data.status}`);
  const progressChanged = data.progressPct !== undefined && data.progressPct !== existing.progressPct;
  if (progressChanged) changes.push(`progress → ${data.progressPct}%`);
  if (changes.length) {
    await db.projectActivity.create({
      data: {
        projectId: id, type: progressChanged ? 'PROGRESS' : 'STATUS_CHANGE',
        title: changes.join(', '), progressPct: progressChanged ? data.progressPct : null,
        isPublic: true, createdById: actor?.id ?? null,
      },
    });
    await queueClientProgress(db, existing, changes.join(', '), progressChanged ? data.progressPct : null);
  }
  return updated;
}

export async function remove(id) {
  const db = getPrisma();
  if (!(await db.project.findUnique({ where: { id } }))) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Project not found', 'PROJECT_NOT_FOUND');
  }
  await db.project.delete({ where: { id } });
}


export async function listActivities(projectId, query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = { projectId };
  const [items, total] = await Promise.all([
    db.projectActivity.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
    db.projectActivity.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function addActivity(projectId, body, actor) {
  const title = body?.title?.trim();
  if (!title) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'title is required', 'VALIDATION_ERROR');

  const db = getPrisma();
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found', 'PROJECT_NOT_FOUND');

  let progressPct = null;
  if (body?.progressPct !== undefined && body.progressPct !== null) {
    progressPct = Math.max(0, Math.min(100, Number(body.progressPct) || 0));
    await db.project.update({ where: { id: projectId }, data: { progressPct } });
  }

  const activity = await db.projectActivity.create({
    data: {
      projectId,
      type: body?.type || (progressPct !== null ? 'PROGRESS' : 'NOTE'),
      title,
      detail: body?.detail ?? null,
      progressPct,
      isPublic: body?.isPublic ?? true,
      createdById: actor?.id ?? null,
    },
  });
  if (activity.isPublic) await queueClientProgress(db, project, activity.title, activity.progressPct);
  return activity;
}



export async function assignMachinery(projectId, body, actor) {
  const machineryId = body?.machineryId;
  if (!machineryId) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'machineryId is required', 'VALIDATION_ERROR');

  const db = getPrisma();
  return db.$transaction(async (tx) => {
    const project = await tx.project.findUnique({ where: { id: projectId } });
    if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found', 'PROJECT_NOT_FOUND');
    const machine = await tx.machinery.findUnique({ where: { id: machineryId } });
    if (!machine) throw new ApiError(httpStatus.NOT_FOUND, 'Machinery not found', 'MACHINERY_NOT_FOUND');

    const active = await tx.projectMachinery.findFirst({ where: { projectId, machineryId, releasedAt: null } });
    if (active) throw new ApiError(httpStatus.CONFLICT, 'Machine already assigned to this project', 'ALREADY_ASSIGNED');

    const assignment = await tx.projectMachinery.create({
      data: {
        projectId, machineryId,
        startDate: body?.startDate ? new Date(body.startDate) : null,
        endDate: body?.endDate ? new Date(body.endDate) : null,
        rate: body?.rate ?? machine.hireRate ?? null,
        status: 'allocated',
      },
    });
    await tx.machinery.update({ where: { id: machineryId }, data: { status: 'IN_USE' } });
    await tx.projectActivity.create({
      data: { projectId, type: 'ASSIGNMENT', title: `Machinery assigned: ${machine.name}`, isPublic: true, createdById: actor?.id ?? null },
    });
    return assignment;
  });
}

export async function releaseMachinery(projectId, assignmentId) {
  const db = getPrisma();
  return db.$transaction(async (tx) => {
    const assignment = await tx.projectMachinery.findFirst({ where: { id: assignmentId, projectId }, include: { machinery: true } });
    if (!assignment) throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found', 'ASSIGNMENT_NOT_FOUND');

    await tx.projectMachinery.update({ where: { id: assignmentId }, data: { releasedAt: new Date(), status: 'returned' } });
    await tx.machinery.update({ where: { id: assignment.machineryId }, data: { status: 'AVAILABLE' } });
    await tx.projectActivity.create({
      data: { projectId, type: 'ASSIGNMENT', title: `Machinery released: ${assignment.machinery.name}`, isPublic: false },
    });
    return { released: true };
  });
}

export async function assignLabour(projectId, body, actor) {
  const labourId = body?.labourId;
  if (!labourId) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'labourId is required', 'VALIDATION_ERROR');

  const db = getPrisma();
  return db.$transaction(async (tx) => {
    const project = await tx.project.findUnique({ where: { id: projectId } });
    if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found', 'PROJECT_NOT_FOUND');
    const worker = await tx.labour.findUnique({ where: { id: labourId } });
    if (!worker) throw new ApiError(httpStatus.NOT_FOUND, 'Labour not found', 'LABOUR_NOT_FOUND');

    const existing = await tx.projectLabour.findUnique({ where: { projectId_labourId: { projectId, labourId } } });
    if (existing && existing.active) throw new ApiError(httpStatus.CONFLICT, 'Labour already assigned to this project', 'ALREADY_ASSIGNED');

    const assignment = existing
      ? await tx.projectLabour.update({ where: { id: existing.id }, data: { active: true, releasedAt: null, projectRole: body?.projectRole ?? null, assignedById: actor?.id ?? null, assignedAt: new Date() } })
      : await tx.projectLabour.create({ data: { projectId, labourId, projectRole: body?.projectRole ?? null, assignedById: actor?.id ?? null } });

    await tx.labour.update({ where: { id: labourId }, data: { status: 'ASSIGNED' } });
    await tx.projectActivity.create({
      data: { projectId, type: 'ASSIGNMENT', title: 'Labour assigned to project', isPublic: true, createdById: actor?.id ?? null },
    });


    if (worker.role === 'SITE_MANAGER' && worker.phone) {
      await tx.notification.create({
        data: {
          recipientType: 'LABOUR', labourId, channel: 'WHATSAPP',
          templateType: 'manager_assignment',
          payload: { projectId, projectCode: project.code, projectName: project.name, labourName: worker.name },
          status: 'QUEUED', projectId,
        },
      });
    }
    return assignment;
  });
}

export async function releaseLabour(projectId, assignmentId) {
  const db = getPrisma();
  return db.$transaction(async (tx) => {
    const assignment = await tx.projectLabour.findFirst({ where: { id: assignmentId, projectId } });
    if (!assignment) throw new ApiError(httpStatus.NOT_FOUND, 'Assignment not found', 'ASSIGNMENT_NOT_FOUND');

    await tx.projectLabour.update({ where: { id: assignmentId }, data: { active: false, releasedAt: new Date() } });

    const stillActive = await tx.projectLabour.count({ where: { labourId: assignment.labourId, active: true } });
    if (stillActive === 0) await tx.labour.update({ where: { id: assignment.labourId }, data: { status: 'AVAILABLE' } });

    await tx.projectActivity.create({ data: { projectId, type: 'ASSIGNMENT', title: 'Labour released from project', isPublic: false } });
    return { released: true };
  });
}
