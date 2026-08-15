
import PDFDocument from 'pdfkit';

const money = (n) =>
  Number(n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });


function drawQuotation(doc, q) {
  const left = 50;
  const right = 545;

  // Header
  doc.fontSize(20).text('QUOTATION', { align: 'right' });
  doc.fontSize(10).fillColor('#555')
    .text(q.number, { align: 'right' })
    .text(new Date(q.createdAt).toLocaleDateString('en-KE'), { align: 'right' })
    .text(`Status: ${q.status}`, { align: 'right' });
  doc.fillColor('#000');

  // Parties
  doc.moveDown(2).fontSize(11);
  doc.text(`Service: ${q.service?.name ?? ''}`);
  doc.text(`Client: ${q.client?.name ?? ''}`);
  if (q.client?.companyName) doc.text(q.client.companyName);

  // Table header
  doc.moveDown(1.5);
  let y = doc.y;
  doc.fontSize(10).fillColor('#000');
  doc.text('Description', left, y);
  doc.text('Unit', 300, y);
  doc.text('Qty', 350, y, { width: 40, align: 'right' });
  doc.text('Unit Price', 400, y, { width: 70, align: 'right' });
  doc.text('Amount', 475, y, { width: 70, align: 'right' });
  y += 15;
  doc.moveTo(left, y).lineTo(right, y).strokeColor('#ccc').stroke();
  y += 6;

  // Rows
  for (const it of q.items || []) {
    if (y > 740) { doc.addPage(); y = 50; }
    doc.text(it.description ?? '', left, y, { width: 245 });
    const rowH = doc.heightOfString(it.description ?? '', { width: 245 });
    doc.text(it.unit ?? '', 300, y);
    doc.text(money(it.quantity), 350, y, { width: 40, align: 'right' });
    doc.text(money(it.unitPrice), 400, y, { width: 70, align: 'right' });
    doc.text(money(it.lineTotal), 475, y, { width: 70, align: 'right' });
    y += Math.max(rowH, 12) + 6;
  }

  // Totals
  doc.moveTo(left, y).lineTo(right, y).strokeColor('#ccc').stroke();
  y += 10;
  const label = (t, v, bold) => {
    doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(bold ? 12 : 10);
    doc.text(t, 350, y, { width: 100, align: 'right' });
    doc.text(`${q.currency} ${money(v)}`, 455, y, { width: 90, align: 'right' });
    y += bold ? 20 : 15;
  };
  label('Subtotal', q.subtotal);
  if (Number(q.discountValue) > 0) {
    label(q.discountType === 'PERCENT' ? `Discount (${q.discountValue}%)` : 'Discount', q.discountValue);
  }
  label(`VAT (${q.taxRatePct}%)`, q.taxAmount);
  label('Total', q.total, true);

  // Notes / validity
  doc.font('Helvetica').fontSize(9).fillColor('#555');
  if (q.notes) doc.moveDown(1).text(q.notes, left, doc.y, { width: right - left });
  if (q.validUntil) doc.moveDown(0.5).text(`Valid until: ${new Date(q.validUntil).toLocaleDateString('en-KE')}`);
}


export function renderQuotationPdf(q) {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  drawQuotation(doc, q);
  doc.end();
  return doc;
}

// Buffer variant — used when attaching the PDF to an email.
export function renderQuotationPdfBuffer(q) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    drawQuotation(doc, q);
    doc.end();
  });
}

export default renderQuotationPdf;
