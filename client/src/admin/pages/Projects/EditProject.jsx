import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import ProjectEditForm from '../../features/projects/ProjectEditForm';
import useProjects from '../../features/projects/useProjects';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, loading, error, fetchOne, update } = useProjects();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchOne(id);
  }, [id, fetchOne]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await update(id, payload);
      navigate(`/admin/projects/${id}`, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to save changes.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !project) return <Loading label="Loading project…" />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  return (
    <PageContainer
      title="Edit project"
      breadcrumbs={
        <Breadcrumbs
          items={[
            { label: 'Projects', to: ADMIN_PATHS.PROJECTS },
            { label: project.name, to: `/admin/projects/${id}` },
            { label: 'Edit' },
          ]}
        />
      }
    >
      {submitError && (
        <div className="mb-5 max-w-2xl rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</div>
      )}
      <div className="max-w-2xl">
        <ProjectEditForm project={project} submitting={submitting} onSubmit={handleSubmit} />
      </div>
    </PageContainer>
  );
}

export default EditProject;