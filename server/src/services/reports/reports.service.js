import { getPrisma } from '../../config/db.js';

const tally = (rows, key = 'status') => {
  const out = {};
  for (const r of rows) out[r[key]] = r._count._all;
  return out;
};
const sum = (obj) => Object.values(obj).reduce((a, b) => a + b, 0);


function dateRangeFilter(query, field) {
  const from = query?.from ? new Date(query.from) : null;
  const to = query?.to ? new Date(query.to) : null;
  if ((from && Number.isNaN(from.getTime())) || (to && Number.isNaN(to.getTime()))) return {};
  if (!from && !to) return {};
  const range = {};
  if (from) range.gte = from;
  if (to) {
   
    const end = new Date(to);
    if (query.to.length <= 10) end.setHours(23, 59, 59, 999);
    range.lte = end;
  }
  return { [field]: range };
}

export async function dashboard(query = {}) {
  const db = getPrisma();
  const createdRange = dateRangeFilter(query, 'createdAt');
  const [projByStatus, openRequests, quoByStatus, acceptedValue, leads, machAvail, labAvail, contactUnhandled, queued] =
    await Promise.all([
      db.project.groupBy({ by: ['status'], where: createdRange, _count: { _all: true } }),
      db.serviceRequest.count({ where: { status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'QUOTED'] } } }),
      db.quotation.groupBy({ by: ['status'], where: createdRange, _count: { _all: true } }),
      db.quotation.aggregate({ _sum: { total: true }, where: { status: { in: ['ACCEPTED', 'CONVERTED'] }, ...createdRange } }),
      db.lead.count({ where: createdRange }),
      db.machinery.count({ where: { status: 'AVAILABLE' } }),
      db.labour.count({ where: { status: 'AVAILABLE', isActive: true } }),
      db.contactMessage.count({ where: { handled: false } }),
      db.notification.count({ where: { status: 'QUEUED' } }),
    ]);
  const proj = tally(projByStatus);
  return {
    projects: { total: sum(proj), active: proj.ACTIVE || 0, byStatus: proj },
    openServiceRequests: openRequests,
    quotations: { byStatus: tally(quoByStatus), acceptedValue: acceptedValue._sum.total || 0 },
    leads,
    machineryAvailable: machAvail,
    labourAvailable: labAvail,
    unhandledContactMessages: contactUnhandled,
    queuedNotifications: queued,
  };
}

export async function projects(query = {}) {
  const db = getPrisma();
  const now = new Date();
  const createdRange = dateRangeFilter(query, 'createdAt');
  const [byStatus, delayed, recent] = await Promise.all([
    db.project.groupBy({ by: ['status'], where: createdRange, _count: { _all: true } }),
    db.project.count({ where: { status: { notIn: ['COMPLETED', 'CANCELLED'] }, expectedEndDate: { lt: now }, ...createdRange } }),
    db.project.findMany({
      where: createdRange,
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: { id: true, code: true, name: true, status: true, progressPct: true, createdAt: true },
    }),
  ]);
  const s = tally(byStatus);
  return { total: sum(s), byStatus: s, delayed, recent };
}

export async function machinery() {
  const db = getPrisma();
  const [byStatus, total, activeAssignments] = await Promise.all([
    db.machinery.groupBy({ by: ['status'], _count: { _all: true } }),
    db.machinery.count(),
    db.projectMachinery.count({ where: { releasedAt: null } }),
  ]);
  const s = tally(byStatus);
  const inUse = (s.IN_USE || 0) + (s.HIRED || 0);
  return { total, byStatus: s, inUse, utilizationPct: total ? Math.round((inUse / total) * 100) : 0, activeAssignments };
}

export async function labour() {
  const db = getPrisma();
  const [byStatus, byRole, activeAssignments] = await Promise.all([
    db.labour.groupBy({ by: ['status'], _count: { _all: true } }),
    db.labour.groupBy({ by: ['role'], _count: { _all: true } }),
    db.projectLabour.count({ where: { active: true } }),
  ]);
  return { byStatus: tally(byStatus), byRole: tally(byRole, 'role'), activeAssignments };
}

export async function quotations(query = {}) {
  const db = getPrisma();
  const createdRange = dateRangeFilter(query, 'createdAt');
  const [byStatus, valueAgg] = await Promise.all([
    db.quotation.groupBy({ by: ['status'], where: createdRange, _count: { _all: true } }),
    db.quotation.aggregate({ _sum: { total: true }, where: { status: { in: ['ACCEPTED', 'CONVERTED'] }, ...createdRange } }),
  ]);
  const s = tally(byStatus);
  const won = (s.ACCEPTED || 0) + (s.CONVERTED || 0);
  const decided = won + (s.REJECTED || 0);
  return { total: sum(s), byStatus: s, acceptedValue: valueAgg._sum.total || 0, conversionRate: decided ? Math.round((won / decided) * 100) : 0 };
}

export async function crm(query = {}) {
  const db = getPrisma();
  const now = new Date();
  const createdRange = dateRangeFilter(query, 'createdAt');
  const [leadByStatus, clients, openFollowUps, overdueFollowUps] = await Promise.all([
    db.lead.groupBy({ by: ['status'], where: createdRange, _count: { _all: true } }),
    db.client.count({ where: createdRange }),
    db.followUp.count({ where: { done: false } }),
    db.followUp.count({ where: { done: false, dueDate: { lt: now } } }),
  ]);
  const s = tally(leadByStatus);
  const totalLeads = sum(s);
  return {
    leads: { total: totalLeads, byStatus: s, conversionRate: totalLeads ? Math.round(((s.CONVERTED || 0) / totalLeads) * 100) : 0 },
    clients,
    openFollowUps,
    overdueFollowUps,
  };
}

export async function payments(query = {}) {
  const db = getPrisma();
  const paidRange = dateRangeFilter(query, 'paidAt');
  const [agg, byMethod, recent, outstandingRows] = await Promise.all([
    db.payment.aggregate({ _sum: { amount: true }, _count: { _all: true }, where: paidRange }),
    db.payment.groupBy({ by: ['method'], where: paidRange, _sum: { amount: true }, _count: { _all: true } }),
    db.payment.findMany({
      where: paidRange,
      take: 10,
      orderBy: { paidAt: 'desc' },
      include: { project: { select: { code: true, name: true } }, client: { select: { name: true } } },
    }),
    db.project.findMany({
      where: { status: { in: ['PENDING', 'ACTIVE', 'ON_HOLD'] }, quotationId: { not: null } },
      select: { id: true, code: true, name: true, quotation: { select: { total: true } }, payments: { select: { amount: true } } },
    }),
  ]);

  let outstandingTotal = 0;
  const outstandingProjects = [];
  for (const p of outstandingRows) {
    const ref = p.quotation ? Number(p.quotation.total) : 0;
    const paid = p.payments.reduce((s, x) => s + Number(x.amount), 0);
    const outstanding = Math.round((ref - paid) * 100) / 100;
    if (outstanding > 0) {
      outstandingTotal += outstanding;
      outstandingProjects.push({ id: p.id, code: p.code, name: p.name, referenceAmount: ref, paid, outstanding });
    }
  }

  return {
    totalCollected: agg._sum.amount || 0,
    count: agg._count._all,
    byMethod: byMethod.map((m) => ({ method: m.method || 'unspecified', total: m._sum.amount || 0, count: m._count._all })),
    outstandingTotal: Math.round(outstandingTotal * 100) / 100,
    outstandingProjects,
    recent,
  };
}



export function toExportRows(type, data) {
  switch (type) {
    case 'dashboard':
      return [
        { metric: 'Projects (total)', value: data.projects.total },
        { metric: 'Projects (active)', value: data.projects.active },
        ...Object.entries(data.projects.byStatus).map(([k, v]) => ({ metric: `Projects - ${k}`, value: v })),
        { metric: 'Open service requests', value: data.openServiceRequests },
        ...Object.entries(data.quotations.byStatus).map(([k, v]) => ({ metric: `Quotations - ${k}`, value: v })),
        { metric: 'Quotations accepted value', value: data.quotations.acceptedValue },
        { metric: 'Leads', value: data.leads },
        { metric: 'Machinery available', value: data.machineryAvailable },
        { metric: 'Labour available', value: data.labourAvailable },
        { metric: 'Unhandled contact messages', value: data.unhandledContactMessages },
        { metric: 'Queued notifications', value: data.queuedNotifications },
      ];

    case 'projects':
      return data.recent.map((p) => ({
        id: p.id,
        code: p.code,
        name: p.name,
        status: p.status,
        progressPct: p.progressPct,
        createdAt: p.createdAt,
      }));

    case 'machinery':
      return [
        { metric: 'Total', value: data.total },
        { metric: 'In use', value: data.inUse },
        { metric: 'Utilization %', value: data.utilizationPct },
        { metric: 'Active assignments', value: data.activeAssignments },
        ...Object.entries(data.byStatus).map(([k, v]) => ({ metric: `Status - ${k}`, value: v })),
      ];

    case 'labour':
      return [
        { metric: 'Active assignments', value: data.activeAssignments },
        ...Object.entries(data.byStatus).map(([k, v]) => ({ metric: `Status - ${k}`, value: v })),
        ...Object.entries(data.byRole).map(([k, v]) => ({ metric: `Role - ${k}`, value: v })),
      ];

    case 'quotations':
      return [
        { metric: 'Total', value: data.total },
        { metric: 'Accepted value', value: data.acceptedValue },
        { metric: 'Conversion rate %', value: data.conversionRate },
        ...Object.entries(data.byStatus).map(([k, v]) => ({ metric: `Status - ${k}`, value: v })),
      ];

    case 'crm':
      return [
        { metric: 'Leads (total)', value: data.leads.total },
        { metric: 'Lead conversion rate %', value: data.leads.conversionRate },
        ...Object.entries(data.leads.byStatus).map(([k, v]) => ({ metric: `Leads - ${k}`, value: v })),
        { metric: 'Clients', value: data.clients },
        { metric: 'Open follow-ups', value: data.openFollowUps },
        { metric: 'Overdue follow-ups', value: data.overdueFollowUps },
      ];

    case 'payments':
      return data.recent.map((p) => ({
        id: p.id,
        project: p.project ? `${p.project.code} - ${p.project.name}` : '',
        client: p.client?.name || '',
        amount: p.amount,
        currency: p.currency,
        method: p.method || '',
        reference: p.reference || '',
        paidAt: p.paidAt,
      }));

    default:
      return [];
  }
}