import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import Button from '../../../shared/components/common/Button';
import useProjects from '../../features/projects/useProjects';
import { formatCurrency, formatDate } from '../../../shared/utils/formatters';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function ProjectDetails() {
  const { id } = useParams();
  const { project, loading, error, fetchOne } = useProjects();

  useEffect(() => {
    // The server must verify this user is authorized to view this
    // specific project (object-level authorization), not just that
    // they're an authenticated admin — prevents IDOR via a guessed id.
    fetchOne(id);
  }, [id, fetchOne]);

  if (loading) return <Loading label="Loading project..." />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;
  if (!project) return null;

  return (
    <PageContainer
      actions={
        <Link to={`/admin/projects/${id}/edit`}>
          <Button variant="secondary">Edit</Button>
        </Link>
      }
    >
      <Breadcrumbs items={[{ label: 'Projects', to: ADMIN_PATHS.PROJECTS }, { label: project.name }]} />
      <h1 className="text-xl font-semibold text-gray-900">{project.name}</h1>
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-500">Client</dt>
          <dd className="text-gray-900">{project.client}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Status</dt>
          <dd className="text-gray-900">{project.status}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Budget</dt>
          <dd className="text-gray-900">{formatCurrency(project.budget)}</dd>
        </div>
        <div>
          <dt className="text-gray-500">Created</dt>
          <dd className="text-gray-900">{formatDate(project.createdAt)}</dd>
        </div>
      </dl>
    </PageContainer>
  );
}

export default ProjectDetails;
