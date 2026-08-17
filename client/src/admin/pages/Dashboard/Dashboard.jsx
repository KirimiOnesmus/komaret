import { Link } from 'react-router-dom';
import {
  FaHardHat,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaTruck,
  FaUsersCog,
  FaAddressBook,
  FaEnvelopeOpenText,
  FaBell,
  FaExclamationTriangle,
  FaArrowRight,
  FaPlus,
  FaSyncAlt,
  FaRegCheckCircle,
} from 'react-icons/fa';

import PageContainer from '../../../shared/components/ui/PageContainer';
import Loading from '../../../shared/components/common/Loading';
import useAuth from '../../../shared/hooks/useAuth';
import useDashboard from '../../features/dashboard/useDashboard';
import { ADMIN_PATHS } from '../../../shared/constants/routes';


const NAVY = '#071525';
const GOLD = '#f5b400';


function compactKES(value) {
  const v = Number(value) || 0;
  if (v >= 1000000) return `KSh ${(v / 1000000).toFixed(v >= 10000000 ? 0 : 1)}M`;
  if (v >= 1000) return `KSh ${Math.round(v / 1000)}K`;
  return `KSh ${v.toLocaleString('en-KE')}`;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const TODAY = new Intl.DateTimeFormat('en-KE', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
}).format(new Date());


const PROJECT_STATUS = {
  PENDING: { label: 'Pending', dot: '#f59e0b' },
  ACTIVE: { label: 'Active', dot: '#2563eb' },
  ON_HOLD: { label: 'On hold', dot: '#6b7280' },
  COMPLETED: { label: 'Completed', dot: '#16a34a' },
  CANCELLED: { label: 'Cancelled', dot: '#dc2626' },
};
const PROJECT_ORDER = ['PENDING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'];

const QUOTATION_STATUS = {
  DRAFT: { label: 'Draft', cls: 'bg-gray-100 text-gray-600' },
  SENT: { label: 'Sent', cls: 'bg-blue-50 text-blue-700' },
  UNDER_REVIEW: { label: 'Under review', cls: 'bg-amber-50 text-amber-700' },
  ACCEPTED: { label: 'Accepted', cls: 'bg-green-50 text-green-700' },
  REJECTED: { label: 'Rejected', cls: 'bg-red-50 text-red-700' },
  EXPIRED: { label: 'Expired', cls: 'bg-gray-100 text-gray-500' },
  CONVERTED: { label: 'Converted', cls: 'bg-[#071525] text-[#f5b400]' },
};

function ProjectStatusPill({ status }) {
  const s = PROJECT_STATUS[status] || { label: status, dot: '#6b7280' };
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: s.dot }} />
      {s.label}
    </span>
  );
}


function StatTile({ icon: Icon, label, value, sub, to }) {
  const body = (
    <div className="group h-full rounded-xl border border-gray-200 bg-white p-5 transition-colors duration-150 hover:border-[#f5b400]/60">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</p>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#f5b400]/10 text-[#f5b400] transition-colors group-hover:bg-[#f5b400] group-hover:text-[#071525]">
          <Icon />
        </span>
      </div>
      <p className="mt-3 text-3xl font-bold text-[#071525]">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
  return to ? (
    <Link to={to} className="block h-full" aria-label={`${label}: ${value}`}>
      {body}
    </Link>
  ) : (
    body
  );
}


function PipelineBar({ status, count, total }) {
  const s = PROJECT_STATUS[status] || { label: status, dot: '#6b7280' };
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="flex items-center gap-2 text-gray-700">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: s.dot }} />
          {s.label}
        </span>
        <span className="flex items-baseline gap-1.5">
          <span className="font-semibold text-[#071525]">{count}</span>
          <span className="text-xs text-gray-400">{pct}%</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full transition-[width] duration-300"
          style={{ width: `${pct}%`, backgroundColor: s.dot }}
        />
      </div>
    </div>
  );
}


function AttentionRow({ icon: Icon, label, count, to, tone = 'default' }) {
  const tones = {
    default: 'text-gray-400',
    warn: 'text-amber-500',
    danger: 'text-red-500',
  };
  const badgeTones = {
    default: 'bg-[#071525]',
    warn: 'bg-amber-500',
    danger: 'bg-red-600',
  };
  return (
    <Link
      to={to}
      className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 transition-colors hover:bg-gray-50"
    >
      <span className="flex min-w-0 items-center gap-3 text-sm text-gray-700">
        <Icon className={`shrink-0 ${tones[tone]}`} />
        <span className="truncate">{label}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span
          className={`min-w-[1.5rem] rounded-md px-2 py-0.5 text-center text-xs font-bold text-white ${badgeTones[tone]}`}
        >
          {count}
        </span>
        <FaArrowRight className="text-[10px] text-gray-300" />
      </span>
    </Link>
  );
}

function ResourceStat({ icon: Icon, label, value, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:border-[#f5b400]/50 hover:bg-gray-50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#071525] text-[#f5b400]">
        <Icon className="text-sm" />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-bold leading-none text-[#071525]">{value}</p>
        <p className="mt-1 truncate text-xs text-gray-500">{label}</p>
      </div>
    </Link>
  );
}

function SectionCard({ title, hint, action, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-[#071525]">{title}</h2>
          {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function Dashboard() {
  const { user } = useAuth();
  const { summary, projects, quotations, crm, loading, error, refresh } = useDashboard();

  if (loading && !summary) {
    return (
      <PageContainer>
        <Loading label="Loading your operations overview..." />
      </PageContainer>
    );
  }

  if (error && !summary) {
    return (
      <PageContainer>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-700">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#071525] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d2036]"
          >
            <FaSyncAlt className="text-xs" /> Try again
          </button>
        </div>
      </PageContainer>
    );
  }

  const projectsTotal = summary?.projects?.total ?? 0;
  const projectsByStatus = summary?.projects?.byStatus ?? {};
  const activeProjects = summary?.projects?.active ?? 0;
  const delayedProjects = projects?.delayed ?? 0;

  const openRequests = summary?.openServiceRequests ?? 0;

  const quoByStatus = quotations?.byStatus ?? summary?.quotations?.byStatus ?? {};
  const pendingQuotations =
    (quoByStatus.DRAFT || 0) + (quoByStatus.SENT || 0) + (quoByStatus.UNDER_REVIEW || 0);
  const acceptedValue = quotations?.acceptedValue ?? summary?.quotations?.acceptedValue ?? 0;
  const conversionRate = quotations?.conversionRate ?? 0;

  const machineryAvailable = summary?.machineryAvailable ?? 0;
  const labourAvailable = summary?.labourAvailable ?? 0;
  const leads = summary?.leads ?? crm?.leads?.total ?? 0;
  const clients = crm?.clients ?? 0;
  const overdueFollowUps = crm?.overdueFollowUps ?? 0;
  const unhandledMessages = summary?.unhandledContactMessages ?? 0;
  const queuedNotifications = summary?.queuedNotifications ?? 0;

  const recentProjects = projects?.recent ?? [];

  const attention = [
    { icon: FaClipboardList, label: 'Service requests to review', count: openRequests, to: ADMIN_PATHS.SERVICE_REQUESTS, tone: openRequests ? 'warn' : 'default' },
    { icon: FaFileInvoiceDollar, label: 'Quotations awaiting a reply', count: pendingQuotations, to: ADMIN_PATHS.QUOTATIONS },
    { icon: FaExclamationTriangle, label: 'Projects past their end date', count: delayedProjects, to: ADMIN_PATHS.PROJECTS, tone: delayedProjects ? 'danger' : 'default' },
    { icon: FaAddressBook, label: 'Overdue follow-ups', count: overdueFollowUps, to: ADMIN_PATHS.CRM, tone: overdueFollowUps ? 'warn' : 'default' },
    { icon: FaEnvelopeOpenText, label: 'Unread contact messages', count: unhandledMessages, to: ADMIN_PATHS.CRM },
    { icon: FaBell, label: 'Notifications queued to send', count: queuedNotifications, to: ADMIN_PATHS.COMMUNICATIONS },
  ].filter((row) => row.count > 0);

  return (
    <PageContainer>
      <div className="space-y-6">

        <section
          className="relative overflow-hidden rounded-2xl px-6 py-7 sm:px-8"
          style={{
            background: `linear-gradient(135deg, ${NAVY} 0%, #0d2036 60%, #12304f 100%)`,
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage: 'radial-gradient(circle at 80% 30%, black, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(circle at 80% 30%, black, transparent 70%)',
            }}
          />
          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#f5b400]">
                Komaret Design &amp; Construction
              </p>
              <h1 className="mt-2 text-2xl font-bold leading-tight text-white sm:text-3xl">
                {greeting()}
                {user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </h1>
              <p className="mt-1 text-sm text-blue-100/80">{TODAY}</p>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-blue-100/70">
                {activeProjects} active {activeProjects === 1 ? 'project' : 'projects'},{' '}
                {openRequests} open {openRequests === 1 ? 'request' : 'requests'} and{' '}
                {pendingQuotations} {pendingQuotations === 1 ? 'quotation' : 'quotations'} awaiting a reply.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to={ADMIN_PATHS.PROJECT_CREATE}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#f5b400] px-4 py-2 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#dca300]"
                >
                  <FaPlus className="text-xs" /> New project
                </Link>
                <Link
                  to={ADMIN_PATHS.QUOTATION_CREATE}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <FaFileInvoiceDollar className="text-xs" /> New quotation
                </Link>
              </div>
            </div>

            <div className="relative shrink-0 rounded-xl border border-white/15 bg-white/5 px-6 py-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-100/70">
                Accepted quotation value
              </p>
              <p className="mt-2 text-3xl font-bold text-[#f5b400]">{compactKES(acceptedValue)}</p>
              <p className="mt-1 text-xs text-blue-100/70">{conversionRate}% quotation win rate</p>
            </div>
          </div>
        </section>


        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatTile
            icon={FaHardHat}
            label="Active projects"
            value={activeProjects}
            sub={`${projectsTotal} total on record`}
            to={ADMIN_PATHS.PROJECTS}
          />
          <StatTile
            icon={FaClipboardList}
            label="Open service requests"
            value={openRequests}
            sub="Submitted, reviewing or quoted"
            to={ADMIN_PATHS.SERVICE_REQUESTS}
          />
          <StatTile
            icon={FaFileInvoiceDollar}
            label="Pending quotations"
            value={pendingQuotations}
            sub="Draft, sent or under review"
            to={ADMIN_PATHS.QUOTATIONS}
          />
          <StatTile
            icon={FaTruck}
            label="Machinery available"
            value={machineryAvailable}
            sub={`${labourAvailable} workers free`}
            to={ADMIN_PATHS.MACHINERY}
          />
        </div>


        <div className="grid gap-6 lg:grid-cols-3">

          <div className="space-y-6 lg:col-span-2">
            <SectionCard
              title="Project pipeline"
              hint="Every project by its current status"
              action={
                <Link
                  to={ADMIN_PATHS.REPORTS}
                  className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#071525] hover:text-[#f5b400]"
                >
                  Reports <FaArrowRight className="text-[10px]" />
                </Link>
              }
            >
              {projectsTotal === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  No projects yet. Create your first project to start tracking the pipeline.
                </p>
              ) : (
                <div className="space-y-4">
                  {PROJECT_ORDER.filter((s) => (projectsByStatus[s] || 0) > 0 || s === 'ACTIVE').map(
                    (s) => (
                      <PipelineBar
                        key={s}
                        status={s}
                        count={projectsByStatus[s] || 0}
                        total={projectsTotal}
                      />
                    )
                  )}
                  {delayedProjects > 0 && (
                    <p className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                      <FaExclamationTriangle className="shrink-0" />
                      {delayedProjects} {delayedProjects === 1 ? 'project is' : 'projects are'} past
                      the expected end date.
                    </p>
                  )}
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Recent projects"
              hint="Latest records created"
              action={
                <Link
                  to={ADMIN_PATHS.PROJECTS}
                  className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-[#071525] hover:text-[#f5b400]"
                >
                  View all <FaArrowRight className="text-[10px]" />
                </Link>
              }
            >
              {recentProjects.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">No projects to show yet.</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentProjects.slice(0, 6).map((p) => (
                    <li key={p.id}>
                      <Link
                        to={`/admin/projects/${p.id}`}
                        className="flex items-center gap-4 py-3 transition-colors hover:bg-gray-50"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-[#071525]">{p.name}</p>
                          <p className="mt-0.5 font-mono text-xs text-gray-400">{p.code}</p>
                        </div>
                        <div className="hidden w-28 shrink-0 sm:block">
                          <div className="mb-1 flex justify-between text-[10px] text-gray-400">
                            <span>Progress</span>
                            <span>{p.progressPct ?? 0}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${p.progressPct ?? 0}%`, backgroundColor: GOLD }}
                            />
                          </div>
                        </div>
                        <ProjectStatusPill status={p.status} />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </SectionCard>
          </div>


          <div className="space-y-6">
            <SectionCard title="Needs attention" hint="Open items across the back office">
              {attention.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <FaRegCheckCircle className="text-2xl text-green-500" />
                  <p className="text-sm text-gray-500">You&apos;re all caught up.</p>
                </div>
              ) : (
                <div className="-mx-2.5 space-y-0.5">
                  {attention.map((row) => (
                    <AttentionRow key={row.label} {...row} />
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Resources & CRM" hint="Availability and client base">
              <div className="grid grid-cols-2 gap-3">
                <ResourceStat
                  icon={FaTruck}
                  label="Machinery free"
                  value={machineryAvailable}
                  to={ADMIN_PATHS.MACHINERY}
                />
                <ResourceStat
                  icon={FaUsersCog}
                  label="Labour free"
                  value={labourAvailable}
                  to={ADMIN_PATHS.LABOUR}
                />
                <ResourceStat
                  icon={FaAddressBook}
                  label="Leads"
                  value={leads}
                  to={ADMIN_PATHS.CRM}
                />
                <ResourceStat
                  icon={FaHardHat}
                  label="Clients"
                  value={clients}
                  to={ADMIN_PATHS.CRM}
                />
              </div>
            </SectionCard>

            {Object.keys(quoByStatus).length > 0 && (
              <SectionCard title="Quotation status" hint="Where quotes stand right now">
                <div className="flex flex-wrap gap-2">
                  {Object.entries(quoByStatus).map(([status, count]) => {
                    const meta = QUOTATION_STATUS[status] || {
                      label: status,
                      cls: 'bg-gray-100 text-gray-600',
                    };
                    return (
                      <span
                        key={status}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${meta.cls}`}
                      >
                        {meta.label}
                        <span className="font-bold">{count}</span>
                      </span>
                    );
                  })}
                </div>
              </SectionCard>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default Dashboard;
