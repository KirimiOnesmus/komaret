import { getPrisma } from '../../config/db.js';
import { parsePagination } from '../../utils/pagination.js';
import { ApiError } from '../../utils/ApiError.js';
import httpStatus from '../../utils/httpStatus.js';
import { drainQueue } from './worker.js';

export async function list(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  if (query?.status) where.status = query.status;
  if (query?.channel) where.channel = query.channel;
  if (query?.recipientType) where.recipientType = query.recipientType;

  const [items, total] = await Promise.all([
    db.notification.findMany({
      where, skip, take, orderBy: { createdAt: 'desc' },
      include: {
        labour: { select: { name: true, role: true } },
        client: { select: { name: true } },
        project: { select: { code: true, name: true } },
      },
    }),
    db.notification.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}


export async function dispatch() {
  return drainQueue();
}


export async function retry(id) {
  const db = getPrisma();
  const n = await db.notification.findUnique({ where: { id } });
  if (!n) throw new ApiError(httpStatus.NOT_FOUND, 'Notification not found', 'NOTIFICATION_NOT_FOUND');
  return db.notification.update({ where: { id }, data: { status: 'QUEUED', error: null, scheduledAt: new Date() } });
}



export async function listContactMessages(query) {
  const db = getPrisma();
  const { skip, take, page, limit } = parsePagination(query);
  const where = {};
  if (query?.handled !== undefined) where.handled = query.handled === 'true' || query.handled === true;

  const [items, total] = await Promise.all([
    db.contactMessage.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
    db.contactMessage.count({ where }),
  ]);
  return { items, meta: { page, limit, total, pages: Math.ceil(total / limit) } };
}

export async function markContactMessageHandled(id, handled = true) {
  const db = getPrisma();
  const message = await db.contactMessage.findUnique({ where: { id } });
  if (!message) throw new ApiError(httpStatus.NOT_FOUND, 'Contact message not found', 'CONTACT_MESSAGE_NOT_FOUND');
  return db.contactMessage.update({ where: { id }, data: { handled } });
}