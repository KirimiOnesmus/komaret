
import { getPrisma } from '../../config/db.js';
import { parsePagination } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';

export async function list(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  for (const k of ['projectId', 'quotationId', 'clientId']) if (query?.[k]) where[k] = query[k];

  const [items, total, agg] = await Promise.all([
    db.payment.findMany({
      where, skip, take, orderBy: { paidAt: 'desc' },
      include: { project: { select: { code: true, name: true } }, client: { select: { name: true } } },
    }),
    db.payment.count({ where }),
    db.payment.aggregate({ _sum: { amount: true }, where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit), totalAmount: agg._sum.amount || 0 } };
}

export async function getById(id) {
  const db = getPrisma();
  const p = await db.payment.findUnique({ where: { id }, include: { project: true, quotation: true, client: true } });
  if (!p) throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found', 'PAYMENT_NOT_FOUND');
  return p;
}

export async function create(body, actor) {
  const amount = Number(body?.amount);
  if (!amount || amount <= 0) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'A positive amount is required', 'VALIDATION_ERROR');
  if (!body?.projectId && !body?.quotationId && !body?.clientId && !body?.invoiceId) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Link the payment to a project, quotation, invoice or client', 'TARGET_REQUIRED');
  }

  const db = getPrisma();
  return db.$transaction(async (tx) => {
    if (body.projectId && !(await tx.project.findUnique({ where: { id: body.projectId } }))) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Project not found', 'PROJECT_NOT_FOUND');
    }
    const payment = await tx.payment.create({
      data: {
        amount, currency: body?.currency || 'KES',
        method: body?.method ?? null, reference: body?.reference ?? null,
        paidAt: body?.paidAt ? new Date(body.paidAt) : new Date(),
        note: body?.note ?? null,
        projectId: body?.projectId || null, quotationId: body?.quotationId || null, clientId: body?.clientId || null, invoiceId: body?.invoiceId || null,
        recordedById: actor?.id ?? null,
      },
    });
    if (payment.projectId) {
      await tx.projectActivity.create({
        data: { projectId: payment.projectId, type: 'PAYMENT', title: `Payment recorded: ${payment.currency} ${amount}`, isPublic: false, createdById: actor?.id ?? null },
      });
    }
    if (payment.invoiceId) {
      const inv = await tx.invoice.findUnique({ where: { id: payment.invoiceId }, include: { payments: true } });
      if (inv) {
        const paid = inv.payments.reduce((sm, x) => sm + Number(x.amount), 0);
        const status = paid >= Number(inv.total) ? 'PAID' : (paid > 0 ? 'PARTIAL' : inv.status);
        if (status !== inv.status) await tx.invoice.update({ where: { id: inv.id }, data: { status } });
      }
    }
    return payment;
  });
}

export async function update(id, body) {
  const db = getPrisma();
  if (!(await db.payment.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found', 'PAYMENT_NOT_FOUND');
  const data = {};
  for (const k of ['amount', 'currency', 'method', 'reference', 'note']) if (body?.[k] !== undefined) data[k] = body[k];
  if (body?.paidAt !== undefined) data.paidAt = body.paidAt ? new Date(body.paidAt) : undefined;
  if (data.amount !== undefined && (!Number(data.amount) || Number(data.amount) <= 0)) {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'A positive amount is required', 'VALIDATION_ERROR');
  }
  return db.payment.update({ where: { id }, data });
}

export async function remove(id) {
  const db = getPrisma();
  if (!(await db.payment.findUnique({ where: { id } }))) throw new ApiError(httpStatus.NOT_FOUND, 'Payment not found', 'PAYMENT_NOT_FOUND');
  await db.payment.delete({ where: { id } });
}

export async function projectSummary(projectId) {
  const db = getPrisma();
  const project = await db.project.findUnique({ where: { id: projectId }, include: { quotation: true, payments: { orderBy: { paidAt: 'desc' } } } });
  if (!project) throw new ApiError(httpStatus.NOT_FOUND, 'Project not found', 'PROJECT_NOT_FOUND');

  const totalPaid = project.payments.reduce((s, p) => s + Number(p.amount), 0);
  const referenceAmount = project.quotation ? Number(project.quotation.total) : (project.budget != null ? Number(project.budget) : null);
  const outstanding = referenceAmount != null ? Math.round((referenceAmount - totalPaid) * 100) / 100 : null;
  const paidPct = referenceAmount ? Math.min(100, Math.round((totalPaid / referenceAmount) * 100)) : null;

  return {
    projectId,
    currency: project.payments[0]?.currency || project.quotation?.currency || 'KES',
    referenceAmount, totalPaid, outstanding, paidPct,
    source: project.quotation ? 'quotation' : (project.budget != null ? 'budget' : 'none'),
    payments: project.payments,
  };
}
