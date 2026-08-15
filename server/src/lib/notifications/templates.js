
import { config } from '../../config/env.js';

export function renderTemplate(templateType, payload = {}) {
  const p = payload || {};
  const company = config.company?.name || 'our team';
  switch (templateType) {
    case 'contact_reply': {
      return {
        subject: `Re: ${p.subject || 'your enquiry'}`.trim(),
        text:
          `Hi ${p.name || 'there'},\n\n` +
          `${p.body || ''}\n\n` +
          `Warm regards,\n${company}`,
      };
    }
    case 'contact_thankyou': {
      const kind =
        p.type === 'COMPLAINT'
          ? 'your message'
          : p.type === 'TESTIMONIAL'
            ? 'your feedback'
            : 'your enquiry';
      return {
        subject: `Thank you for contacting ${company}`,
        text:
          `Hi ${p.name || 'there'},\n\n` +
          `Thank you for reaching out to ${company}. We've received ${kind} and a member of our team will get back to you shortly.\n\n` +
          `Warm regards,\n${company}`,
      };
    }
    case 'manager_assignment':
      return {
        subject: `New project assignment: ${p.projectName ?? ''}`.trim(),
        text: `Hi ${p.labourName ?? ''}, you have been assigned to project `
          + `${p.projectName ?? ''} (${p.projectCode ?? ''}). Please check in with the office.`,
      };
    case 'project_progress': {
      const pct = p.progressPct != null ? ` It is now ${p.progressPct}% complete.` : '';
      const msg = p.message ? ` ${p.message}.` : '';
      return {
        subject: `Update on your project: ${p.projectName ?? ''}`.trim(),
        text: `There is an update on your project ${p.projectName ?? ''} `
          + `(${p.projectCode ?? ''}).${msg}${pct}`,
      };
    }
    default:
      return { subject: 'Notification', text: JSON.stringify(p) };
  }
}
