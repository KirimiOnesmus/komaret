
export function renderTemplate(templateType, payload = {}) {
  const p = payload || {};
  switch (templateType) {
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
