import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaFilePdf, FaPrint, FaPaperPlane } from 'react-icons/fa';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import Button from '../../../shared/components/common/Button';
import Select from '../../../shared/components/common/Select';
import useQuotation from '../../../shared/hooks/useQuotation';
import quotationService from '../../../shared/services/quotationService';
import { formatCurrency } from '../../../shared/utils/formatters';
import { QUOTATION_STATUSES, QUOTATION_STATUS_LABELS, DISCOUNT_TYPE_LABELS } from '../../../shared/constants/app';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

const STATUS_OPTIONS = QUOTATION_STATUSES.map((s) => ({ value: s, label: QUOTATION_STATUS_LABELS[s] || s }));

function fmtDate(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function QuotationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { quotation, loading, error, updateStatus, remove, fetchOne } = useQuotation({ id });
  const [busy, setBusy] = useState(false);
  const [sending, setSending] = useState(false);

  if (loading || !quotation) return <Loading label="Loading quotation…" />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  const q = quotation;

  const handleStatus = (e) => updateStatus(id, e.target.value);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${q.number}? This cannot be undone.`)) return;
    setBusy(true);
    try {
      await remove(id);
      navigate(ADMIN_PATHS.QUOTATIONS, { replace: true });
    } catch (err) {
      alert(err.message || 'Unable to delete this quotation.');
      setBusy(false);
    }
  };

  const handlePdf = async () => {
    try {
      const res = await quotationService.downloadPdf(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `${q.number}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      alert('Unable to download the PDF.');
    }
  };

  const handlePrint = async () => {
    try {
      const res = await quotationService.downloadPdf(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const w = window.open(url, '_blank');
      if (w) {
        w.addEventListener('load', () => {
          w.focus();
          w.print();
        });
      }
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      alert('Unable to open the quotation for printing.');
    }
  };

  const handleSend = async () => {
    if (!q.client?.email) {
      alert('This client has no email address on file, so the quotation can’t be emailed.');
      return;
    }
    if (!window.confirm(`Email quotation ${q.number} to ${q.client.email}?`)) return;
    setSending(true);
    try {
      const { data } = await quotationService.sendToClient(id);
      await fetchOne(id);
      alert(`Quotation sent to ${data.to}.`);
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to send the quotation.');
    } finally {
      setSending(false);
    }
  };

  const validUntil = fmtDate(q.validUntil);

  return (
    <PageContainer
      breadcrumbs={<Breadcrumbs items={[{ label: 'Quotations', to: ADMIN_PATHS.QUOTATIONS }, { label: q.number }]} />}
      actions={
        <div className="flex items-center gap-2">
          <Button onClick={handleSend} disabled={sending}>
            <FaPaperPlane className="mr-2 text-xs" /> {sending ? 'Sending…' : 'Send to client'}
          </Button>
          <Button variant="secondary" onClick={handlePrint}><FaPrint className="mr-2 text-xs" /> Print</Button>
          <Button variant="secondary" onClick={handlePdf}><FaFilePdf className="mr-2 text-xs" /> PDF</Button>
          <Link to={`/admin/quotations/${id}/edit`}><Button variant="secondary"><FaEdit className="mr-2 text-xs" /> Edit</Button></Link>
          <Button variant="danger" onClick={handleDelete} disabled={busy}><FaTrash className="mr-2 text-xs" /> {busy ? 'Deleting…' : 'Delete'}</Button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-xl font-bold text-[#071525]">{q.number}</h1>
        <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
          {QUOTATION_STATUS_LABELS[q.status] || q.status}
        </span>
      </div>

      <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div><dt className="text-xs uppercase tracking-wide text-gray-400">Client</dt><dd className="mt-1 text-sm font-medium text-[#071525]">{q.client?.name || '—'}</dd></div>
        <div><dt className="text-xs uppercase tracking-wide text-gray-400">Service</dt><dd className="mt-1 text-sm font-medium text-[#071525]">{q.service?.name || '—'}</dd></div>
        <div><dt className="text-xs uppercase tracking-wide text-gray-400">Valid until</dt><dd className="mt-1 text-sm text-gray-700">{validUntil || '—'}</dd></div>
        <div className="max-w-[12rem]">
          <Select id="status" label="Status" options={STATUS_OPTIONS} value={q.status} onChange={handleStatus} />
        </div>
      </dl>

      {/* items */}
      <div className="mt-8 overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2 font-medium">Description</th>
                <th className="px-4 py-2 font-medium">Unit</th>
                <th className="px-4 py-2 font-medium">Qty</th>
                <th className="px-4 py-2 font-medium">Unit price</th>
                <th className="px-4 py-2 font-medium">Line total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {(q.items || []).length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-400">No line items.</td></tr>
              ) : (
                q.items.map((it) => (
                  <tr key={it.id}>
                    <td className="px-4 py-2 text-[#071525]">{it.description}</td>
                    <td className="px-4 py-2 text-gray-600">{it.unit || '—'}</td>
                    <td className="px-4 py-2 text-gray-600">{Number(it.quantity)}</td>
                    <td className="px-4 py-2 text-gray-600">{formatCurrency(it.unitPrice)}</td>
                    <td className="px-4 py-2 text-gray-800">{formatCurrency(it.lineTotal)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      <dl className="mt-4 ml-auto max-w-xs space-y-1.5 text-sm">
        <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd className="text-gray-900">{formatCurrency(q.subtotal)}</dd></div>
        {q.discountType && q.discountType !== 'NONE' && (
          <div className="flex justify-between">
            <dt className="text-gray-500">Discount ({DISCOUNT_TYPE_LABELS[q.discountType]}{q.discountType === 'PERCENT' ? ` ${Number(q.discountValue)}%` : ''})</dt>
            <dd className="text-gray-900">{q.discountType === 'PERCENT' ? `${Number(q.discountValue)}%` : formatCurrency(q.discountValue)}</dd>
          </div>
        )}
        <div className="flex justify-between"><dt className="text-gray-500">VAT ({Number(q.taxRatePct)}%)</dt><dd className="text-gray-900">{formatCurrency(q.taxAmount)}</dd></div>
        <div className="flex justify-between border-t border-gray-200 pt-1.5 text-base font-bold"><dt className="text-[#071525]">Total</dt><dd className="text-[#071525]">{formatCurrency(q.total)}</dd></div>
      </dl>

      {q.notes && (
        <div className="mt-6">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Notes</h2>
          <p className="mt-1 max-w-3xl whitespace-pre-line text-sm leading-6 text-gray-700">{q.notes}</p>
        </div>
      )}
    </PageContainer>
  );
}

export default QuotationDetails;