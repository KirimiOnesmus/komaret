
import { getPrisma } from '../../config/db.js';
import { renderTemplate } from './templates.js';
import { sendEmail } from './providers/email.provider.js';
import { sendWhatsApp } from './providers/whatsapp.provider.js';

export async function sendNotification(n) {
  const db = getPrisma();

  let to;
  if (n.recipientType === 'LABOUR') {
    const labour = await db.labour.findUnique({ where: { id: n.labourId } });
    if (!labour) throw new Error('Recipient (labour) not found');
    to = n.channel === 'WHATSAPP' ? labour.phone : labour.email;
  } else {
    const client = await db.client.findUnique({ where: { id: n.clientId } });
    if (!client) throw new Error('Recipient (client) not found');
    to = n.channel === 'WHATSAPP' ? client.whatsappPhone : client.email;
  }
  if (!to) throw new Error(`No ${n.channel} address for recipient`);

  const content = renderTemplate(n.templateType, n.payload);

  if (n.channel === 'EMAIL') {
    return sendEmail({ to, subject: content.subject, text: content.text, html: content.html });
  }
  if (n.channel === 'WHATSAPP') {
    return sendWhatsApp({ to, text: content.text, templateType: n.templateType, payload: n.payload });
  }
  throw new Error(`Unknown channel: ${n.channel}`);
}
