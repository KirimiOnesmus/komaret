import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import Button from '../../../shared/components/common/Button';
import ProjectImages from '../../features/projects/ProjectImages';
import useProjects from '../../features/projects/useProjects';
import { ADMIN_PATHS } from '../../../shared/constants/routes';
import { PROJECT_STATUS_LABELS } from '../../../shared/constants/app';
import { formatCurrency } from '../../../shared/utils/formatters';

const STATUS_CLASS = {
  PENDING: 'bg-amber-50 text-amber-700',
  ACTIVE: 'bg-blue-50 text-blue-700',
  ON_HOLD: 'bg-gray-100 text-gray-600',
  COMPLETED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-700',
};

function fmtDate(v) {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function Fact({ label, children }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="mt-1 text-sm text-[#071525]">{children}</dd>
    </div>
  );
}

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, loading, error, fetchOne, remove } = useProjects();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchOne(id);
  }, [id, fetchOne]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${project.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await remove(id);
      navigate(ADMIN_PATHS.PROJECTS, { replace: true });
    } catch (err) {
      alert(err.message || 'Unable to delete this project.');
      setDeleting(false);
    }
  };

  if (loading && !project) return <Loading label="Loading project…" />;
  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      </div>
    );
  }
  if (!project) return null;

  return (
    <PageContainer
      title={project.name}
      breadcrumbs={<Breadcrumbs items={[{ label: 'Projects', to: ADMIN_PATHS.PROJECTS }, { label: project.name }]} />}
      actions={
        <div className="flex items-center gap-2">
          <Link to={`/admin/projects/${id}/edit`}>
            <Button variant="secondary">Edit</Button>
          </Link>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deleting…' : 'Delete'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-gray-500">{project.code}</span>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_CLASS[project.status] || 'bg-gray-100 text-gray-600'}`}>
              {PROJECT_STATUS_LABELS[project.status] || project.status}
            </span>
            <span className="text-sm text-gray-500">{project.progressPct ?? 0}% complete</span>
          </div>

          <dl className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Fact label="Client">{project.client?.name || '—'}</Fact>
            <Fact label="Service">{project.service?.name || '—'}</Fact>
            <Fact label="Budget">{project.budget != null ? formatCurrency(project.budget) : '—'}</Fact>
            <Fact label="Location">{project.location || '—'}</Fact>
            <Fact label="Start date">{fmtDate(project.startDate)}</Fact>
            <Fact label="Expected end">{fmtDate(project.expectedEndDate)}</Fact>
          </dl>

          {project.description && (
            <div className="mt-6 border-t border-gray-100 pt-5">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Description</h2>
              <p className="mt-1.5 max-w-3xl whitespace-pre-line text-sm leading-relaxed text-gray-700">{project.description}</p>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-bold text-[#071525]">Project images</h2>
          <ProjectImages projectId={id} images={project.images || []} onChanged={() => fetchOne(id)} />
        </section>
      </div>
    </PageContainer>
  );
}

export default ProjectDetails;