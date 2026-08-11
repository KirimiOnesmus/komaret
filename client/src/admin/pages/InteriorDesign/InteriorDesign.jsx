import { useEffect, useState } from 'react';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import api from '../../../shared/services/api';
import extractList from '../../../shared/utils/api';

const COLUMNS = [
  { key: 'name', label: 'Design project' },
  { key: 'client', label: 'Client' },
  { key: 'status', label: 'Status' },
];

/**
 * No dedicated services/*.js file for interior design in this
 * structure, so this page talks to the shared api.js client directly.
 * Promote to services/interiorDesignService.js if this vertical grows.
 */
function InteriorDesign() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/admin/interior-design')
      .then(({ data }) => {
        if (active) setItems(extractList(data));
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load interior design projects.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageContainer title="Interior Design">
      {loading && <Loading label="Loading design projects..." />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && items.length === 0 && <EmptyState title="No design projects found" />}
      {!loading && !error && items.length > 0 && <Table columns={COLUMNS} data={items} />}
    </PageContainer>
  );
}

export default InteriorDesign;
