import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import NewsForm from '../../features/news/NewsForm';
import useAdminNews from '../../features/news/useAdminNews';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function CreateNews() {
  const navigate = useNavigate();
  const { create } = useAdminNews();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const created = await create(payload);
      navigate(ADMIN_PATHS.NEWS_EDIT.replace(':id', created.id), { replace: true });
    } catch (err) {
      setSubmitError(err.message || 'Unable to create the article.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer
      title="New article"
      breadcrumbs={<Breadcrumbs items={[{ label: 'News', to: ADMIN_PATHS.NEWS }, { label: 'New article' }]} />}
    >
      <div className="max-w-3xl">
        <NewsForm
          mode="create"
          submitting={submitting}
          submitError={submitError}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ADMIN_PATHS.NEWS)}
        />
      </div>
    </PageContainer>
  );
}

export default CreateNews;
