
const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const num = (v) => Number(v) || 0;

export function computeQuotationTotals(items = [], { discountType = 'NONE', discountValue = 0, taxRatePct = 16 } = {}) {
  let subtotal = 0;
  for (const it of items) subtotal += num(it.quantity ?? 1) * num(it.unitPrice);
  subtotal = round2(subtotal);

  let discount = 0;
  if (discountType === 'PERCENT') discount = round2((subtotal * num(discountValue)) / 100);
  else if (discountType === 'FIXED') discount = round2(num(discountValue));
  if (discount > subtotal) discount = subtotal;

  const taxable = round2(subtotal - discount);
  const taxAmount = round2((taxable * num(taxRatePct)) / 100);
  const total = round2(taxable + taxAmount);
  return { subtotal, discount, taxable, taxAmount, total };
}

export default computeQuotationTotals;