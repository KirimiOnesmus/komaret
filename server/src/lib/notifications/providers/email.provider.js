.
import nodemailer from 'nodemailer';
import { config } from '../../../config/env.js';

let transport = null;

function getTransport() {
  if (!config.smtp.host || !config.smtp.user) {
    throw new Error('SMTP not configured (set SMTP_HOST / SMTP_USER / SMTP_PASS)');
  }
  if (!transport) {
    transport = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: { user: config.smtp.user, pass: config.smtp.pass },
    });
  }
  return transport;
}

export async function sendEmail({ to, subject, text, html, attachments }) {
  const info = await getTransport().sendMail({ from: config.smtp.from, to, subject, text, html, attachments });
  return { messageId: info.messageId };
}
