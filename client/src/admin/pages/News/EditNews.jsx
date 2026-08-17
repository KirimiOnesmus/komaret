import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Breadcrumbs from '../../../shared/components/ui/Breadcrumbs';
import Loading from '../../../shared/components/common/Loading';
import NewsForm from '../../features/news/NewsForm';
import NewsImage from '../../features/news/NewsImage';
import useAdminNews from '../../features/news/useAdminNews';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

function EditNews() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { article, loading, error, fetchOne, update, uploadImage, removeImage } = useAdminNews();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchOne(id);
  }, [id, fetchOne]);

  const handleSubmit = async (payload) => {
    setSubmitting(true);
    setSubmitError('');
    setSaved(false);
    try {
      await update(id, payload);
      setSaved(true);
    } catch (err) {
      setSubmitError(err.message || 'Unable to save changes.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !article) return <Loading label="Loading article…" />;
  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <PageContainer
      title="Edit article"
      breadcrumbs={
        <Breadcrumbs
          items={[
            { label: 'News', to: ADMIN_PATHS.NEWS },
            { label: article.title, to: ADMIN_PATHS.NEWS_EDIT.replace(':id', id) },
            { label: 'Edit' },
          ]}
        />
      }
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 max-w-3xl">
          {saved && (
            <p className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
              Changes saved.
            </p>
          )}

          <NewsForm
            mode="edit"
            initialValues={{
              title: article.title || '',
              category: article.category || 'COMPANY_UPDATES',
              excerpt: article.excerpt || '',
              body: article.body || '',
              isPublished: article.isPublished ?? false,
            }}
            submitting={submitting}
            submitError={submitError}
            onSubmit={handleSubmit}
            onCancel={() => navigate(ADMIN_PATHS.NEWS)}
          />
        </div>

        <div className="w-full lg:w-80 lg:flex-shrink-0">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <NewsImage
              articleId={article.id}
              image={article.image}
              onUpload={uploadImage}
              onRemove={removeImage}
            />
          </div>

          {article.isPublished && article.slug && (
            <a
              href={`/news/${encodeURIComponent(article.slug)}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#071525] transition-colors hover:text-[#f5b400]"
            >
              <FaExternalLinkAlt className="text-xs" /> View on public site
            </a>
          )}
        </div>
      </div>
    </PageContainer>
  );
}

export default EditNews;
