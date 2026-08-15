import { useEffect, useState } from 'react';
import {
  FaUsers,
  FaUserTie,
  FaEnvelope,
  FaBuilding,
  FaFilter,
  FaSearch,
} from 'react-icons/fa';

import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';

import useCrm from '../../features/crm/useCrm';


const TABS = [
  {
    key: 'leads',
    label: 'Leads',
    icon: FaUserTie,
  },
  {
    key: 'clients',
    label: 'Clients',
    icon: FaUsers,
  },
];


const STATUS_CLASSES = {
  NEW: 'bg-blue-50 text-blue-700',
  CONTACTED: 'bg-amber-50 text-amber-700',
  QUALIFIED: 'bg-[#f5b400]/10 text-[#071525]',
  CONVERTED: 'bg-emerald-50 text-emerald-700',
  LOST: 'bg-red-50 text-red-700',
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
        STATUS_CLASSES[status] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {status || 'NEW'}
    </span>
  );
}

function getLeadColumns(onConvert, converting) {
  return [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email', render: (row) => row.email || row.phone || '—' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'actions',
      label: '',
      render: (row) =>
        row.status === 'CONVERTED' ? (
          <span className="text-xs text-gray-400">Converted</span>
        ) : (
          <button
            type="button"
            onClick={() => onConvert(row.id)}
            disabled={converting === row.id}
            className="text-xs font-semibold text-blue-600 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            {converting === row.id ? 'Converting…' : 'Convert to client'}
          </button>
        ),
    },
  ];
}

const CLIENT_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email', render: (row) => row.email || row.whatsappPhone || '—' },
  { key: 'companyName', label: 'Company', render: (row) => row.companyName || '—' },
];


function CRM() {
  const [tab, setTab] = useState('leads');
  const [convertingId, setConvertingId] = useState(null);
  const [convertError, setConvertError] = useState(null);

  const {
    leads,
    clients,
    loading,
    error,
    fetchLeads,
    fetchClients,
    convertLead,
  } = useCrm();


  useEffect(() => {
    if (tab === 'leads') {
      fetchLeads();
    } else {
      fetchClients();
    }
  }, [tab, fetchLeads, fetchClients]);


  const handleConvert = async (id) => {
    setConvertingId(id);
    setConvertError(null);
    try {
      await convertLead(id);
      await fetchLeads();
    } catch (err) {
      setConvertError(err.message || 'Unable to convert this lead.');
    } finally {
      setConvertingId(null);
    }
  };

  const rows = Array.isArray(tab === 'leads' ? leads : clients)
    ? (tab === 'leads' ? leads : clients)
    : [];
  const columns = tab === 'leads'
    ? getLeadColumns(handleConvert, convertingId)
    : CLIENT_COLUMNS;


  const totalLeads = leads?.length || 0;
  const totalClients = clients?.length || 0;


  return (
    <PageContainer>

      <div className="mb-8">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#f5b400]">
              Customer Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#071525]">
              CRM
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Manage your leads and clients, track relationships,
              and keep your customer information organized.
            </p>
          </div>

          <div className="flex gap-3">

            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f5b400]/10">
                <FaUserTie className="text-sm text-[#f5b400]" />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Leads
                </p>

                <p className="text-lg font-bold text-[#071525]">
                  {totalLeads}
                </p>
              </div>

            </div>


            <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#071525]/5">
                <FaUsers className="text-sm text-[#071525]" />
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Clients
                </p>

                <p className="text-lg font-bold text-[#071525]">
                  {totalClients}
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>


      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        <div className="border-b border-gray-200 px-5 pt-5 sm:px-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">


            <div className="flex items-center gap-1">

              {TABS.map((item) => {
                const Icon = item.icon;
                const active = tab === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setTab(item.key)}
                    className={`relative flex items-center gap-2 px-4 pb-4 pt-1 text-sm font-semibold transition-colors ${
                      active
                        ? 'text-[#071525]'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >

                    <Icon
                      className={
                        active
                          ? 'text-[#f5b400]'
                          : 'text-gray-400'
                      }
                    />

                    {item.label}

                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        active
                          ? 'bg-[#f5b400]/10 text-[#071525]'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.key === 'leads'
                        ? totalLeads
                        : totalClients}
                    </span>


                    {active && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f5b400]" />
                    )}

                  </button>
                );
              })}

            </div>


  
            <div className="flex items-center gap-2 pb-3">

              <button
                type="button"
                className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 text-xs font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50"
              >
                <FaFilter className="text-gray-400" />
                Filter
              </button>

            </div>

          </div>

        </div>



        <div className="p-5 sm:p-6">

          {convertError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-700">{convertError}</p>
            </div>
          )}

          {loading && (
            <div className="py-12">
              <Loading label={`Loading ${tab}...`} />
            </div>
          )}


          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4">
              <p className="text-sm font-medium text-red-700">
                Unable to load {tab}.
              </p>

              <p className="mt-1 text-xs text-red-600">
                {error}
              </p>
            </div>
          )}


          {!loading && !error && rows.length === 0 && (
            <div className="py-10">
              <EmptyState
                title={`No ${tab} found`}
              />
            </div>
          )}


          {!loading && !error && rows.length > 0 && (
            <div className="overflow-x-auto">
              <Table
                columns={columns}
                data={rows}
              />
            </div>
          )}

        </div>

      </div>



      {!loading && !error && rows.length > 0 && (
        <div className="mt-4 flex items-center justify-between px-1">

          <p className="text-xs text-gray-400">
            Showing{' '}
            <span className="font-semibold text-gray-600">
              {rows.length}
            </span>{' '}
            {tab}
          </p>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <FaEnvelope />
            Customer records
          </div>

        </div>
      )}

    </PageContainer>
  );
}


export default CRM;