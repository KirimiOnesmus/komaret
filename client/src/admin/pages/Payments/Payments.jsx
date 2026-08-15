import { useCallback, useEffect, useState } from 'react';
import { FaPlus, FaReceipt, FaTrash, FaPrint, FaFileInvoiceDollar } from 'react-icons/fa';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import Button from '../../../shared/components/common/Button';
import paymentService from '../../../shared/services/paymentService';
import reportsService from '../../../shared/services/reportsService';
import projectService from '../../../shared/services/projectService';
import extractList from '../../../shared/utils/api';
import { formatCurrency } from '../../../shared/utils/formatters';
import RecordPaymentModal from './RecordPaymentModal';

const TABS = [
  { key: 'list', label: 'Payments' },
  { key: 'report', label: 'Report' },
];

function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Payments() {
  const [tab, setTab] = useState('list');

  const [payments, setPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [projects, setProjects] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await paymentService.list();
      setPayments(extractList(data));
      setTotalAmount(data?.meta?.totalAmount || 0);
    } catch (err) {
      setError(err.message || 'Unable to load payments.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await reportsService.get('payments');
      setReport(data);
    } catch (err) {
      setError(err.message || 'Unable to load the payments report.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // projects power the "record payment" dropdown
    projectService.list().then(({ data }) => setProjects(extractList(data))).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'list') fetchPayments();
    else fetchReport();
  }, [tab, fetchPayments, fetchReport]);

  const handleSave = async (payload) => {
    await paymentService.create(payload);
    setModalOpen(false);
    await fetchPayments();
  };

  const handleReceipt = async (id) => {
    setBusyId(id);
    try {
      const res = await paymentService.receipt(id);
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const w = window.open(url, '_blank');
      if (w) w.addEventListener('load', () => { w.focus(); w.print(); });
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch {
      alert('Unable to open the receipt.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment record?')) return;
    setBusyId(id);
    try {
      await paymentService.remove(id);
      await fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to delete this payment.');
    } finally {
      setBusyId(null);
    }
  };

  const columns = [
    { key: 'paidAt', label: 'Date', render: (r) => fmtDate(r.paidAt) },
    { key: 'project', label: 'Project', render: (r) => r.project?.name || r.client?.name || '—' },
    { key: 'method', label: 'Method', render: (r) => r.method || '—' },
    { key: 'reference', label: 'Reference', render: (r) => r.reference || '—' },
    { key: 'amount', label: 'Amount', render: (r) => <span className="font-medium text-[#071525]">{formatCurrency(r.amount)}</span> },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => handleReceipt(r.id)} disabled={busyId === r.id}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#071525] hover:underline disabled:opacity-50">
            <FaReceipt className="text-[10px]" /> Receipt
          </button>
          <button type="button" onClick={() => handleDelete(r.id)} disabled={busyId === r.id}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:underline disabled:opacity-50">
            <FaTrash className="text-[10px]" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Payments"
      actions={
        tab === 'list' ? (
          <Button onClick={() => setModalOpen(true)}><FaPlus className="mr-2 text-xs" /> Record payment</Button>
        ) : (
          <Button variant="secondary" onClick={() => window.print()}><FaPrint className="mr-2 text-xs" /> Print report</Button>
        )
      }
    >
      {/* tabs */}
      <div className="mb-6 flex gap-2 border-b border-gray-200 print:hidden">
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key ? 'border-[#f5b400] text-[#071525]' : 'border-transparent text-gray-500 hover:text-[#071525]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <Loading label="Loading…" />}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* LIST */}
      {!loading && !error && tab === 'list' && (
        <>
          <div className="mb-6 inline-flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-5 py-3">
            <FaFileInvoiceDollar className="text-[#f5b400]" />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">Total collected</p>
              <p className="text-lg font-bold text-[#071525]">{formatCurrency(totalAmount)}</p>
            </div>
          </div>

          {payments.length === 0 ? (
            <EmptyState title="No payments yet" message="Record a payment to start tracking." />
          ) : (
            <Table columns={columns} data={payments} />
          )}
        </>
      )}

      {/* REPORT */}
      {!loading && !error && tab === 'report' && report && (
        <div className="space-y-8">
          <div>
            <h1 className="hidden text-xl font-bold text-[#071525] print:block">Payments report</h1>
            <p className="hidden text-xs text-gray-500 print:block">Generated {new Date().toLocaleString('en-KE')}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-200 p-5">
              <p className="text-xs uppercase tracking-wide text-gray-400">Total collected</p>
              <p className="mt-1 text-2xl font-bold text-[#071525]">{formatCurrency(report.totalCollected)}</p>
              <p className="mt-1 text-xs text-gray-400">{report.count} payment{report.count === 1 ? '' : 's'}</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-5">
              <p className="text-xs uppercase tracking-wide text-gray-400">Outstanding</p>
              <p className="mt-1 text-2xl font-bold text-[#b54708]">{formatCurrency(report.outstandingTotal)}</p>
              <p className="mt-1 text-xs text-gray-400">across active quoted projects</p>
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-bold text-[#071525]">By method</h2>
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                <tr><th className="px-4 py-2 font-medium">Method</th><th className="px-4 py-2 font-medium">Count</th><th className="px-4 py-2 font-medium">Total</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(report.byMethod || []).map((m) => (
                  <tr key={m.method}><td className="px-4 py-2">{m.method}</td><td className="px-4 py-2">{m.count}</td><td className="px-4 py-2">{formatCurrency(m.total)}</td></tr>
                ))}
                {(report.byMethod || []).length === 0 && <tr><td colSpan={3} className="px-4 py-4 text-center text-gray-400">No payments.</td></tr>}
              </tbody>
            </table>
          </div>

          {(report.outstandingProjects || []).length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-bold text-[#071525]">Outstanding by project</h2>
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr><th className="px-4 py-2 font-medium">Project</th><th className="px-4 py-2 font-medium">Quoted</th><th className="px-4 py-2 font-medium">Paid</th><th className="px-4 py-2 font-medium">Outstanding</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {report.outstandingProjects.map((p) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2">{p.code ? `${p.code} — ` : ''}{p.name}</td>
                      <td className="px-4 py-2">{formatCurrency(p.referenceAmount)}</td>
                      <td className="px-4 py-2">{formatCurrency(p.paid)}</td>
                      <td className="px-4 py-2 font-medium text-[#b54708]">{formatCurrency(p.outstanding)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <RecordPaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        projects={projects}
      />
    </PageContainer>
  );
}

export default Payments;
