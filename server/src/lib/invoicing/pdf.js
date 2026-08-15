
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import PDFDocument from 'pdfkit';
import SVGtoPDF from 'svg-to-pdfkit';
import { config } from '../../config/env.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGO_PATH = path.resolve(__dirname, '../../assets/logo.svg');
let LOGO_SVG = null;
try { LOGO_SVG = fs.readFileSync(LOGO_PATH, 'utf8'); } catch { LOGO_SVG = null; }

const money = (n, cur = 'KES') => `${cur} ${Number(n || 0).toLocaleString('en-KE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const NAVY = '#071525';
const GOLD = '#F5B400';

function buildToBuffer(render) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 48 });
    const chunks = [];
    doc.on('data', (c) => chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    try { render(doc); doc.end(); } catch (e) { reject(e); }
  });
}

function header(doc, title) {
  if (LOGO_SVG) {
    try { SVGtoPDF(doc, LOGO_SVG, 48, 40, { width: 200, height: 48, assumePt: true }); }
    catch { doc.fontSize(18).fillColor(NAVY).text(config.company.name, 48, 48); }
  } else {
    doc.fontSize(18).fillColor(NAVY).text(config.company.name, 48, 48);
  }
  doc.fillColor(GOLD).rect(48, 96, 515, 3).fill();
  doc.fillColor(NAVY).fontSize(20).text(title, 48, 108, { align: 'right' });

  const c = config.company;
  doc.fontSize(9).fillColor('#444');
  const lines = [c.name, c.address, [c.email, c.phone].filter(Boolean).join('  •  '), c.kraPin ? `PIN: ${c.kraPin}` : null].filter(Boolean);
  doc.text(lines.join('\n'), 48, 130);
  doc.moveDown(1.5);
  return 175;
}

function partyBlock(doc, y, inv) {
  doc.fontSize(10).fillColor(NAVY).text('Bill To:', 48, y);
  doc.fillColor('#222').fontSize(10).text(
    [inv.client?.name, inv.client?.companyName, inv.client?.email, inv.client?.whatsappPhone, inv.buyerPin ? `PIN: ${inv.buyerPin}` : null].filter(Boolean).join('\n'),
    48, y + 14);

  doc.fillColor('#222').fontSize(10).text(
    [`Invoice No: ${inv.number}`, `Date: ${new Date(inv.issuedAt || inv.createdAt || Date.now()).toLocaleDateString('en-KE')}`, `Status: ${inv.status}`].join('\n'),
    360, y, { width: 203, align: 'right' });
  return y + 78;
}

function itemsTable(doc, y, inv) {
  const cols = { desc: 48, qty: 300, price: 350, vat: 430, total: 480 };
  doc.fontSize(9).fillColor('#fff');
  doc.rect(48, y, 515, 18).fill(NAVY);
  doc.fillColor('#fff');
  doc.text('Description', cols.desc + 4, y + 5);
  doc.text('Qty', cols.qty, y + 5);
  doc.text('Unit Price', cols.price, y + 5);
  doc.text('VAT', cols.vat, y + 5);
  doc.text('Amount', cols.total, y + 5, { width: 79, align: 'right' });
  y += 22;

  doc.fillColor('#222').fontSize(9);
  for (const it of inv.items) {
    const h = Math.max(14, doc.heightOfString(it.description, { width: 240 }));
    doc.text(it.description, cols.desc + 4, y, { width: 240 });
    doc.text(String(Number(it.quantity)), cols.qty, y);
    doc.text(Number(it.unitPrice).toLocaleString('en-KE', { minimumFractionDigits: 2 }), cols.price, y);
    doc.text(`${Number(it.taxRatePct)}%`, cols.vat, y);
    doc.text(Number(it.lineTotal).toLocaleString('en-KE', { minimumFractionDigits: 2 }), cols.total, y, { width: 79, align: 'right' });
    y += h + 6;
    doc.moveTo(48, y - 3).lineTo(563, y - 3).strokeColor('#eee').stroke();
  }
  return y + 6;
}

function totals(doc, y, inv, cur) {
  const x = 360, w = 203;
  const row = (label, val, bold) => {
    doc.fontSize(bold ? 11 : 10).fillColor(bold ? NAVY : '#333');
    doc.text(label, x, y, { width: 110 });
    doc.text(money(val, cur), x + 90, y, { width: w - 90, align: 'right' });
    y += bold ? 18 : 15;
  };
  row('Subtotal (excl. VAT)', inv.subtotal);
  for (const b of inv.vatBreakdown || []) row(`VAT (${b.ratePct}%)`, b.vat);
  doc.moveTo(x, y).lineTo(x + w, y).strokeColor(GOLD).lineWidth(1.5).stroke();
  y += 6;
  row('Total', inv.total, true);
  return y;
}

export function buildInvoicePdf(inv) {
  const cur = inv.currency || 'KES';
  return buildToBuffer((doc) => {
    let y = header(doc, 'TAX INVOICE');
    y = partyBlock(doc, y, inv);
    y = itemsTable(doc, y, inv);
    y = totals(doc, y, inv, cur);
    if (inv.notes) doc.fontSize(9).fillColor('#555').text(`Notes: ${inv.notes}`, 48, y + 20, { width: 300 });
    doc.fontSize(8).fillColor('#888').text('This is a system-generated tax invoice.', 48, 770, { align: 'center', width: 515 });
  });
}

export function buildReceiptPdf(inv, payments) {
  const cur = inv.currency || 'KES';
  const paid = (payments || []).reduce((s, p) => s + Number(p.amount), 0);
  const balance = Math.round((Number(inv.total) - paid) * 100) / 100;
  return buildToBuffer((doc) => {
    let y = header(doc, 'RECEIPT');
    y = partyBlock(doc, y, inv);
    doc.fontSize(10).fillColor(NAVY).text('Payments received', 48, y);
    y += 16;
    doc.fillColor('#222').fontSize(9);
    for (const p of payments || []) {
      doc.text(`${new Date(p.paidAt).toLocaleDateString('en-KE')}  •  ${p.method || 'payment'}${p.reference ? '  •  ' + p.reference : ''}`, 48, y);
      doc.text(money(p.amount, cur), 360, y, { width: 203, align: 'right' });
      y += 16;
    }
    doc.moveTo(48, y).lineTo(563, y).strokeColor('#eee').stroke();
    y += 10;
    const line = (l, v, bold) => { doc.fontSize(bold ? 11 : 10).fillColor(bold ? NAVY : '#333').text(l, 360, y, { width: 110 }); doc.text(money(v, cur), 450, y, { width: 113, align: 'right' }); y += bold ? 18 : 15; };
    line('Invoice total', inv.total);
    line('Paid', paid);
    doc.moveTo(360, y).lineTo(563, y).strokeColor(GOLD).lineWidth(1.5).stroke(); y += 6;
    line('Balance', balance, true);
    doc.fontSize(11).fillColor(balance <= 0 ? '#1a7f37' : '#b54708').text(balance <= 0 ? 'PAID IN FULL' : 'BALANCE DUE', 48, y - 18);
    doc.fontSize(8).fillColor('#888').text('Thank you for your business.', 48, 770, { align: 'center', width: 515 });
  });
}
