import { useEffect, useState } from 'react';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import useCrm from '../../features/crm/useCrm';

const TABS = [
  { key: 'leads', label: 'Leads' },
  { key: 'clients', label: 'Clients' },
];

const LEAD_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'stage', label: 'Stage' },
];

const CLIENT_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'company', label: 'Company' },
];

function CRM() {
  const [tab, setTab] = useState('leads');
  const { leads, clients, loading, error, fetchLeads, fetchClients } = useCrm();

  useEffect(() => {
    if (tab === 'leads') fetchLeads();
    else fetchClients();
  }, [tab, fetchLeads, fetchClients]);

  const rows = tab === 'leads' ? leads : clients;
  const columns = tab === 'leads' ? LEAD_COLUMNS : CLIENT_COLUMNS;

  return (
    <PageContainer title="CRM">
      <div className="mb-4 flex gap-2 border-b border-gray-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium ${
              tab === t.key
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <Loading label="Loading..." />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && rows.length === 0 && <EmptyState title={`No ${tab} found`} />}
      {!loading && !error && rows.length > 0 && <Table columns={columns} data={rows} />}
    </PageContainer>
  );
}

export default CRM;
