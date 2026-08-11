import { useEffect, useState } from 'react';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import api from '../../../shared/services/api';
import extractList from '../../../shared/utils/api';

const COLUMNS = [
  { key: 'name', label: 'Development' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
];

function RealEstate() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/admin/real-estate')
      .then(({ data }) => {
        if (active) setItems(extractList(data));
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load developments.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageContainer title="Real Estate">
      {loading && <Loading label="Loading developments..." />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && items.length === 0 && <EmptyState title="No developments found" />}
      {!loading && !error && items.length > 0 && <Table columns={COLUMNS} data={items} />}
    </PageContainer>
  );
}

export default RealEstate;
