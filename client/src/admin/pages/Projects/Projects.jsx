import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import SearchBar from '../../../shared/components/common/SearchBar';
import Button from '../../../shared/components/common/Button';
import useProjects from '../../features/projects/useProjects';
import { ADMIN_PATHS } from '../../../shared/constants/routes';
import { PROJECT_STATUS_LABELS } from '../../../shared/constants/app';
import { formatCurrency } from '../../../shared/utils/formatters';

const COLUMNS = [
  {
    key: 'name',
    label: 'Project',
    render: (row) => (
      <div>
        <p className="font-medium text-gray-900">{row.name}</p>
        <p className="font-mono text-xs text-gray-400">{row.code}</p>
      </div>
    ),
  },
  { key: 'client', label: 'Client', render: (row) => row.client?.name || '—' },
  { key: 'service', label: 'Service', render: (row) => row.service?.name || '—' },
  {
    key: 'status',
    label: 'Status',
    render: (row) => PROJECT_STATUS_LABELS[row.status] || row.status,
  },
  { key: 'budget', label: 'Budget', render: (row) => (row.budget != null ? formatCurrency(row.budget) : '—') },
  {
    key: 'actions',
    label: '',
    render: (row) => (
      <Link to={`/admin/projects/${row.id}`} className="text-sm font-medium text-[#071525] hover:underline">
        View
      </Link>
    ),
  },
];

function Projects() {
  const { projects, loading, error, fetchList } = useProjects();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) =>
      [p.name, p.code, p.client?.name, p.service?.name].filter(Boolean).some((v) => v.toLowerCase().includes(q))
    );
  }, [projects, search]);

  return (
    <PageContainer
      title="Projects"
      description="Manage and track your construction and design projects."
      actions={
        <Link to={ADMIN_PATHS.PROJECT_CREATE}>
          <Button>New project</Button>
        </Link>
      }
    >
      <div className="mb-4 max-w-sm">
        <SearchBar onSearch={setSearch} placeholder="Search projects..." />
      </div>

      {loading && <Loading label="Loading projects..." />}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && filtered.length === 0 && <EmptyState title="No projects found" />}
      {!loading && !error && filtered.length > 0 && <Table columns={COLUMNS} data={filtered} />}
    </PageContainer>
  );
}

export default Projects;