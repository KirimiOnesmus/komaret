import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import ProjectForm from '../../features/projects/ProjectForm';
import useProjects from '../../features/projects/useProjects';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function CreateProject() {
  const navigate = useNavigate();
  const { create } = useProjects();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setError('');
    try {
      const created = await create(payload);
      navigate(`/admin/projects/${created.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to create the project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="New project"
      breadcrumbs={<Breadcrumbs items={[{ label: 'Projects', to: ADMIN_PATHS.PROJECTS }, { label: 'New project' }]} />}
    >
      {error && (
        <div className="mb-5 max-w-2xl rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}
      <div className="max-w-2xl">
        <ProjectForm onSubmit={handleSubmit} submitting={submitting} />
      </div>
    </PageContainer>
  );
}

export default CreateProject;