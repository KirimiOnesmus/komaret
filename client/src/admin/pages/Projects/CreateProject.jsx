import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import ProjectForm from '../../features/projects/ProjectForm';
import useProjects from '../../features/projects/useProjects';

function CreateProject() {
  const navigate = useNavigate();
  const { create } = useProjects();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setError('');
    try {
      const created = await create(values);
      navigate(`/admin/projects/${created.id}`, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to create the project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer title="New project">
      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      <ProjectForm onSubmit={handleSubmit} submitting={submitting} />
    </PageContainer>
  );
}

export default CreateProject;
