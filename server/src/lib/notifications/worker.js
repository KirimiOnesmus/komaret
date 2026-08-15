
import { getPrisma } from '../../config/db.js';
import { config } from '../../config/env.js';
import { logger } from '../../config/logger.js';
import { sendNotification } from './dispatch.service.js';

export async function drainQueue(limit = config.notifications.batchSize) {
  const db = getPrisma();
  const now = new Date();

  const due = await db.notification.findMany({
    where: {
      status: { in: ['QUEUED', 'FAILED'] },
      attempts: { lt: config.notifications.maxAttempts },
      scheduledAt: { lte: now },
    },
    take: limit,
    orderBy: { createdAt: 'asc' },
  });

  let sent = 0;
  let failed = 0;

  for (const n of due) {
    await db.notification.update({ where: { id: n.id }, data: { status: 'SENDING' } });
    try {
      const res = await sendNotification(n);
      await db.notification.update({
        where: { id: n.id },
        data: { status: 'SENT', sentAt: new Date(), providerMessageId: res?.messageId ?? null, attempts: n.attempts + 1, error: null },
      });
      sent++;
    } catch (err) {
      await db.notification.update({
        where: { id: n.id },
        data: { status: 'FAILED', attempts: n.attempts + 1, error: String(err?.message || err) },
      });
      failed++;
    }
  }

  if (due.length) logger.info(`Notifications: ${sent} sent, ${failed} failed (of ${due.length})`);
  return { processed: due.length, sent, failed };
}
