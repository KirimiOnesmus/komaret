import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Loading from '../../../shared/components/common/Loading';
import ProjectForm from '../../features/projects/ProjectForm';
import useProjects from '../../features/projects/useProjects';

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { project, loading, error, fetchOne, update } = useProjects();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    fetchOne(id);
  }, [id, fetchOne]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      await update(id, values);
      navigate(`/admin/projects/${id}`, { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to save changes.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !project) return <Loading label="Loading project..." />;
  if (error) return <p className="p-6 text-sm text-red-600">{error}</p>;

  return (
    <PageContainer title="Edit project">
      {submitError && <p className="mb-4 text-sm text-red-600">{submitError}</p>}
      <ProjectForm initialValues={project} onSubmit={handleSubmit} submitting={submitting} />
    </PageContainer>
  );
}

export default EditProject;
