import { useCallback, useEffect, useState } from 'react';
import {
  FaChartBar,
  FaBuilding,
  FaTools,
  FaUsersCog,
  FaFileInvoiceDollar,
  FaUserTie,
  FaMoneyBillWave,
  FaDownload,
  FaFilter,
} from 'react-icons/fa';

import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import reportsService from '../../../shared/services/reportsService';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';

const REPORT_TYPES = [
  { key: 'dashboard', label: 'Overview', icon: FaChartBar, supportsRange: true },
  { key: 'projects', label: 'Projects', icon: FaBuilding, supportsRange: true },
  { key: 'quotations', label: 'Quotations', icon: FaFileInvoiceDollar, supportsRange: true },
  { key: 'crm', label: 'CRM', icon: FaUserTie, supportsRange: true },
  { key: 'payments', label: 'Payments', icon: FaMoneyBillWave, supportsRange: true },
  { key: 'machinery', label: 'Machinery', icon: FaTools, supportsRange: false },
  { key: 'labour', label: 'Labour', icon: FaUsersCog, supportsRange: false },
];

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#071525]">{value ?? '-'}</p>
    </div>
  );
}

function BreakdownList({ title, data }) {
  const entries = Object.entries(data || {});
  const max = Math.max(1, ...entries.map(([, v]) => v));
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <p className="mb-4 text-sm font-bold text-[#071525]">{title}</p>
      {entries.length === 0 ? (
        <p className="text-sm text-gray-400">No data for this range.</p>
      ) : (
        <div className="space-y-3">
          {entries.map(([key, value]) => (
            <div key={key}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-gray-600">{key}</span>
                <span className="text-gray-400">{value}</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-gray-100">
                <div
                  className="h-1.5 rounded-full bg-[#f5b400]"
                  style={{ width: `${Math.round((value / max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const PROJECT_COLUMNS = [
  { key: 'code', label: 'Code' },
  { key: 'name', label: 'Name' },
  { key: 'status', label: 'Status' },
  { key: 'progressPct', label: 'Progress', render: (row) => `${row.progressPct ?? 0}%` },
  { key: 'createdAt', label: 'Created', render: (row) => formatDate(row.createdAt) },
];

const PAYMENT_COLUMNS = [
  {
    key: 'project',
    label: 'Project',
    render: (row) => (row.project ? `${row.project.code} — ${row.project.name}` : '—'),
  },
  { key: 'client', label: 'Client', render: (row) => row.client?.name || '—' },
  { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount, row.currency) },
  { key: 'method', label: 'Method', render: (row) => row.method || '—' },
  { key: 'paidAt', label: 'Paid', render: (row) => formatDate(row.paidAt) },
];

function DashboardReport({ data }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Projects" value={data.projects.total} />
        <StatCard label="Active projects" value={data.projects.active} />
        <StatCard label="Open service requests" value={data.openServiceRequests} />
        <StatCard label="Leads" value={data.leads} />
        <StatCard label="Machinery available" value={data.machineryAvailable} />
        <StatCard label="Labour available" value={data.labourAvailable} />
        <StatCard label="Unhandled contact messages" value={data.unhandledContactMessages} />
        <StatCard label="Queued notifications" value={data.queuedNotifications} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <BreakdownList title="Projects by status" data={data.projects.byStatus} />
        <BreakdownList title="Quotations by status" data={data.quotations.byStatus} />
      </div>
      <div className="mt-4">
        <StatCard label="Accepted quotation value" value={formatCurrency(data.quotations.acceptedValue)} />
      </div>
    </>
  );
}

function ProjectsReport({ data }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total projects" value={data.total} />
        <StatCard label="Delayed" value={data.delayed} />
      </div>
      <div className="mt-6">
        <BreakdownList title="Projects by status" data={data.byStatus} />
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <p className="text-sm font-bold text-[#071525]">Most recent projects</p>
        </div>
        <div className="overflow-x-auto p-5 pt-0">
          <Table columns={PROJECT_COLUMNS} data={data.recent} emptyMessage="No projects in this range." />
        </div>
      </div>
    </>
  );
}

function MachineryReport({ data }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total machinery" value={data.total} />
        <StatCard label="In use" value={data.inUse} />
        <StatCard label="Utilization" value={`${data.utilizationPct}%`} />
        <StatCard label="Active assignments" value={data.activeAssignments} />
      </div>
      <div className="mt-6">
        <BreakdownList title="Machinery by status" data={data.byStatus} />
      </div>
    </>
  );
}

function LabourReport({ data }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Active assignments" value={data.activeAssignments} />
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <BreakdownList title="Labour by status" data={data.byStatus} />
        <BreakdownList title="Labour by role" data={data.byRole} />
      </div>
    </>
  );
}

function QuotationsReport({ data }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total quotations" value={data.total} />
        <StatCard label="Accepted value" value={formatCurrency(data.acceptedValue)} />
        <StatCard label="Conversion rate" value={`${data.conversionRate}%`} />
      </div>
      <div className="mt-6">
        <BreakdownList title="Quotations by status" data={data.byStatus} />
      </div>
    </>
  );
}

function CrmReport({ data }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total leads" value={data.leads.total} />
        <StatCard label="Lead conversion rate" value={`${data.leads.conversionRate}%`} />
        <StatCard label="Clients" value={data.clients} />
        <StatCard label="Open follow-ups" value={data.openFollowUps} />
        <StatCard label="Overdue follow-ups" value={data.overdueFollowUps} />
      </div>
      <div className="mt-6">
        <BreakdownList title="Leads by status" data={data.leads.byStatus} />
      </div>
    </>
  );
}

function PaymentsReport({ data }) {
  const byMethod = Object.fromEntries((data.byMethod || []).map((m) => [m.method, m.count]));
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total collected" value={formatCurrency(data.totalCollected)} />
        <StatCard label="Payments recorded" value={data.count} />
        <StatCard label="Outstanding" value={formatCurrency(data.outstandingTotal)} />
      </div>
      <div className="mt-6">
        <BreakdownList title="Payments by method" data={byMethod} />
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-5 py-4">
          <p className="text-sm font-bold text-[#071525]">Most recent payments</p>
        </div>
        <div className="overflow-x-auto p-5 pt-0">
          <Table columns={PAYMENT_COLUMNS} data={data.recent} emptyMessage="No payments in this range." />
        </div>
      </div>
    </>
  );
}

const REPORT_RENDERERS = {
  dashboard: DashboardReport,
  projects: ProjectsReport,
  machinery: MachineryReport,
  labour: LabourReport,
  quotations: QuotationsReport,
  crm: CrmReport,
  payments: PaymentsReport,
};

function Reports() {
  const [type, setType] = useState('dashboard');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  const [appliedRange, setAppliedRange] = useState({ from: '', to: '' });

  const activeType = REPORT_TYPES.find((t) => t.key === type) || REPORT_TYPES[0];

  const fetchReport = useCallback(async (reportType, range) => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (range.from) params.from = range.from;
      if (range.to) params.to = range.to;
      const { data: result } = await reportsService.get(reportType, params);
      setData(result);
    } catch (err) {
      setError(err.message || 'Unable to load this report.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(type, activeType.supportsRange ? appliedRange : {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleApplyFilter = () => {
    const range = { from: fromInput, to: toInput };
    setAppliedRange(range);
    fetchReport(type, range);
  };

  const handleClearFilter = () => {
    setFromInput('');
    setToInput('');
    setAppliedRange({ from: '', to: '' });
    fetchReport(type, { from: '', to: '' });
  };

  const handleExport = async () => {
    setExporting(true);
    setError(null);
    try {
      const range = activeType.supportsRange ? appliedRange : {};
      const params = {};
      if (range.from) params.from = range.from;
      if (range.to) params.to = range.to;
      await reportsService.exportCsv(type, params);
    } catch (err) {
      setError(err.message || 'Unable to export this report.');
    } finally {
      setExporting(false);
    }
  };

  const Renderer = REPORT_RENDERERS[type];
  const hasActiveFilter = Boolean(appliedRange.from || appliedRange.to);

  return (
    <PageContainer
      title="Reports"
      description="Operational and financial reports across the business, with date filtering and CSV export."
      actions={
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || loading || !data}
          className="flex items-center gap-2 rounded-xl bg-[#f5b400] px-5 py-2.5 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#e0a600] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaDownload className="text-xs" />
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      }
    >
      <div className="mb-6 flex flex-wrap items-center gap-1 border-b border-gray-200">
        {REPORT_TYPES.map((item) => {
          const Icon = item.icon;
          const active = type === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setType(item.key)}
              className={`relative flex items-center gap-2 px-4 pb-3 pt-1 text-sm font-semibold transition-colors ${
                active ? 'text-[#071525]' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className={active ? 'text-[#f5b400]' : 'text-gray-400'} />
              {item.label}
              {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f5b400]" />}
            </button>
          );
        })}
      </div>

      {activeType.supportsRange && (
        <div className="mb-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white p-4 sm:flex-row sm:items-end sm:gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="report-from" className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              From
            </label>
            <input
              id="report-from"
              type="date"
              value={fromInput}
              onChange={(e) => setFromInput(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/10"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="report-to" className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              To
            </label>
            <input
              id="report-to"
              type="date"
              value={toInput}
              onChange={(e) => setToInput(e.target.value)}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#f5b400] focus:ring-2 focus:ring-[#f5b400]/10"
            />
          </div>
          <button
            type="button"
            onClick={handleApplyFilter}
            className="flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <FaFilter className="text-xs text-gray-400" />
            Apply
          </button>
          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleClearFilter}
              className="text-sm font-semibold text-[#071525] transition-colors hover:text-[#f5b400] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {loading && <Loading label="Loading report..." />}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {!loading && !error && data && Renderer && <Renderer data={data} />}
    </PageContainer>
  );
}

export default Reports;