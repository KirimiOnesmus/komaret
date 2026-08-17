import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaNewspaper, FaPlus, FaEdit, FaTrash, FaCheckCircle, FaRegCircle } from 'react-icons/fa';

import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import { formatDate } from '../../../shared/utils/formatters';
import useAdminNews, { NEWS_CATEGORY_OPTIONS } from '../../features/news/useAdminNews';
import { ADMIN_PATHS } from '../../../shared/constants/routes';

const CATEGORY_LABELS = Object.fromEntries(NEWS_CATEGORY_OPTIONS.map((o) => [o.value, o.label]));

function News() {
  const { articles, loading, error, fetchList, remove } = useAdminNews();

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDelete = async (article) => {
    if (!window.confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    try {
      await remove(article.id);
    } catch {
      // error surfaced via hook state on next render
    }
  };

  const columns = [
    { key: 'title', label: 'Title', render: (row) => <span className="font-medium text-[#071525]">{row.title}</span> },
    { key: 'category', label: 'Category', render: (row) => CATEGORY_LABELS[row.category] || row.category },
    {
      key: 'isPublished',
      label: 'Status',
      render: (row) =>
        row.isPublished ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
            <FaCheckCircle className="text-[10px]" /> Published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-500">
            <FaRegCircle className="text-[10px]" /> Draft
          </span>
        ),
    },
    { key: 'publishedAt', label: 'Date', render: (row) => formatDate(row.publishedAt || row.createdAt) },
    {
      key: 'actions',
      label: '',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            to={ADMIN_PATHS.NEWS_EDIT.replace(':id', row.id)}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-[#071525] transition-colors hover:bg-[#f5b400]/10 hover:text-[#f5b400]"
          >
            <FaEdit /> Edit
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
          >
            <FaTrash /> Delete
          </button>
        </div>
      ),
    },
  ];

  const publishedCount = articles.filter((a) => a.isPublished).length;

  return (
    <PageContainer>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">Content</p>
          <h2 className="mt-1 text-2xl font-bold text-[#071525]">News &amp; Insights</h2>
          <p className="mt-1 max-w-xl text-sm text-gray-500">
            Write company updates and industry insights for the public news page.
          </p>
        </div>

        <Link
          to={ADMIN_PATHS.NEWS_CREATE}
          className="inline-flex w-fit items-center gap-2 rounded-md bg-[#f5b400] px-4 py-2.5 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#e5a900]"
        >
          <FaPlus /> New article
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#071525] text-[#f5b400]">
              <FaNewspaper />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total articles</p>
              <p className="text-xl font-bold text-[#071525]">{articles.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50 text-green-600">
              <FaCheckCircle />
            </div>
            <div>
              <p className="text-xs text-gray-500">Published</p>
              <p className="text-xl font-bold text-[#071525]">{publishedCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[#071525] text-[#f5b400]">
          <FaNewspaper />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#071525]">Articles</h3>
          <p className="text-xs text-gray-500">Drafts and published posts</p>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-8">
          <Loading label="Loading news…" />
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-10">
          <EmptyState title="No articles yet" />
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <Table columns={columns} data={articles} />
      )}
    </PageContainer>
  );
}

export default News;
