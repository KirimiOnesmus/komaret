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
  if (query?.type && ['ENQUIRY', 'COMPLAINT', 'TESTIMONIAL'].includes(query.type)) where.type = query.type;

  const [items, total] = await Promise.all([
    db.contactMessage.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' },
      include: { replies: { orderBy: { createdAt: 'asc' } } },
    }),
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

export const MAX_PUBLISHED_TESTIMONIALS = 6;

export async function replyToContactMessage(id, { body, channel } = {}) {
  const db = getPrisma();
  const message = await db.contactMessage.findUnique({ where: { id } });
  if (!message) throw new ApiError(httpStatus.NOT_FOUND, 'Contact message not found', 'CONTACT_MESSAGE_NOT_FOUND');

  if (message.type === 'TESTIMONIAL') {
    throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Testimonials cannot be replied to — publish them instead', 'CANNOT_REPLY_TESTIMONIAL');
  }

  const text = (body || '').trim();
  if (!text) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Reply body is required', 'VALIDATION_ERROR');

  
  let ch = channel;
  if (!ch) ch = message.email ? 'EMAIL' : (message.phone ? 'WHATSAPP' : null);
  if (!ch) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'This message has no email or phone to reply to', 'NO_REPLY_ADDRESS');
  if (ch === 'EMAIL' && !message.email) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'No email address on this message', 'NO_EMAIL');
  if (ch === 'WHATSAPP' && !message.phone) throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'No phone number on this message', 'NO_PHONE');

  const reply = await db.$transaction(async (tx) => {
    const created = await tx.contactReply.create({
      data: { contactMessageId: id, channel: ch, body: text },
    });
    await tx.notification.create({
      data: {
        recipientType: 'CONTACT',
        channel: ch,
        templateType: 'contact_reply',
        payload: { name: message.name, email: message.email, phone: message.phone, subject: message.subject, body: text },
        status: 'QUEUED',
      },
    });
  
    
    await tx.contactMessage.update({ where: { id }, data: { handled: true } });
    return created;
  });

  return reply;
}

export async function setContactMessagePublished(id, publish) {
  const db = getPrisma();
  const message = await db.contactMessage.findUnique({ where: { id } });
  if (!message) throw new ApiError(httpStatus.NOT_FOUND, 'Contact message not found', 'CONTACT_MESSAGE_NOT_FOUND');

  if (publish) {
    if (message.type !== 'TESTIMONIAL') {
      throw new ApiError(httpStatus.UNPROCESSABLE_ENTITY, 'Only testimonials can be published to the website', 'NOT_A_TESTIMONIAL');
    }
    if (!message.isPublished) {
      const publishedCount = await db.contactMessage.count({ where: { type: 'TESTIMONIAL', isPublished: true } });
      if (publishedCount >= MAX_PUBLISHED_TESTIMONIALS) {
        throw new ApiError(
          httpStatus.UNPROCESSABLE_ENTITY,
          `You can publish at most ${MAX_PUBLISHED_TESTIMONIALS} testimonials. Unpublish one first.`,
          'TESTIMONIAL_LIMIT_REACHED'
        );
      }
    }
  }

  return db.contactMessage.update({ where: { id }, data: { isPublished: Boolean(publish) } });
}