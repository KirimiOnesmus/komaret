

function escapeCell(value) {
  if (value === null || value === undefined) return '';
  const str = value instanceof Date ? value.toISOString() : String(value);
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}


export function arrayToCsv(rows) {
  if (!Array.isArray(rows) || rows.length === 0) return '';
  const columns = [];
  const seen = new Set();
  for (const row of rows) {
    for (const key of Object.keys(row || {})) {
      if (!seen.has(key)) {
        seen.add(key);
        columns.push(key);
      }
    }
  }
  const lines = [columns.join(',')];
  for (const row of rows) {
    lines.push(columns.map((col) => escapeCell(row?.[col])).join(','));
  }
  return lines.join('\n');
}


export function objectToCsv(obj, { keyHeader = 'metric', valueHeader = 'value' } = {}) {
  const entries = Object.entries(obj || {});
  const lines = [`${keyHeader},${valueHeader}`];
  for (const [key, value] of entries) {
    lines.push(`${escapeCell(key)},${escapeCell(value)}`);
  }
  return lines.join('\n');
}

export function sendCsv(res, filename, csv) {
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.status(200).send(csv);
}

export default { arrayToCsv, objectToCsv, sendCsv };