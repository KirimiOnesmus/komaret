import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import SearchBar from '../../../shared/components/common/SearchBar';
import Button from '../../../shared/components/common/Button';
import useProjects from '../../features/projects/useProjects';
import { ADMIN_PATHS } from '../../../shared/constants/routes';
import { formatCurrency } from '../../../shared/utils/formatters';

const COLUMNS = [
  { key: 'name', label: 'Project' },
  { key: 'client', label: 'Client' },
  { key: 'status', label: 'Status' },
  { key: 'budget', label: 'Budget', render: (row) => formatCurrency(row.budget) },
  {
    key: 'actions',
    label: '',
    render: (row) => (
      <Link to={`/admin/projects/${row.id}`} className="text-blue-600 hover:underline">
        View
      </Link>
    ),
  },
];

function Projects() {
  const { projects, loading, error, fetchList } = useProjects();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchList({ search });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  return (
    <PageContainer
      title="Projects"
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
      {!loading && !error && projects.length === 0 && <EmptyState title="No projects found" />}
      {!loading && !error && projects.length > 0 && <Table columns={COLUMNS} data={projects} />}
    </PageContainer>
  );
}

export default Projects;
