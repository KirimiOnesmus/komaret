
export const TAX_RATE_BY_CODE = { A: 0, B: 16, C: 0, D: 0, E: 8 };
export const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

export function rateForCode(code) {
  return TAX_RATE_BY_CODE[code] ?? 16;
}


export function computeInvoiceTotals(items) {
  const lines = items.map((it, idx) => {
    const quantity = Number(it.quantity) || 0;
    const unitPrice = Number(it.unitPrice) || 0;
    const taxCode = it.taxCode || 'B';
    const taxRatePct = it.taxRatePct != null ? Number(it.taxRatePct) : rateForCode(taxCode);
    const lineNet = round2(quantity * unitPrice);
    const lineVat = round2(lineNet * (taxRatePct / 100));
    return {
      description: (it.description || '').trim(),
      unit: it.unit ?? null,
      quantity, unitPrice, taxCode, taxRatePct,
      lineNet, lineVat, lineTotal: round2(lineNet + lineVat),
      sortOrder: it.sortOrder ?? idx,
    };
  });

  const subtotal = round2(lines.reduce((s, l) => s + l.lineNet, 0));
  const vatAmount = round2(lines.reduce((s, l) => s + l.lineVat, 0));
  const total = round2(subtotal + vatAmount);


  const byRate = {};
  for (const l of lines) {
    const k = l.taxRatePct;
    byRate[k] = byRate[k] || { ratePct: k, net: 0, vat: 0 };
    byRate[k].net = round2(byRate[k].net + l.lineNet);
    byRate[k].vat = round2(byRate[k].vat + l.lineVat);
  }
  return { lines, subtotal, vatAmount, total, vatBreakdown: Object.values(byRate) };
}
