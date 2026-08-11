import { useEffect, useState } from 'react';
import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import api from '../../../shared/services/api';
import { formatDateTime } from '../../../shared/utils/formatters';
import extractList from '../../../shared/utils/api';

const COLUMNS = [
  { key: 'channel', label: 'Channel' },
  { key: 'subject', label: 'Subject' },
  { key: 'sentAt', label: 'Sent', render: (row) => formatDateTime(row.sentAt) },
];

/**
 * No dedicated services/*.js file for communications in this
 * structure, so this page talks to the shared api.js client directly.
 * Message bodies from any channel (email/WhatsApp/live chat) are
 * rendered as plain text via JSX — never via dangerouslySetInnerHTML —
 * so untrusted message content can't execute as HTML/script (XSS).
 */
function Communications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/admin/communications')
      .then(({ data }) => {
        if (active) setItems(extractList(data));
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load communications.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <PageContainer title="Communications">
      {loading && <Loading label="Loading communications..." />}
      {error && <p className="text-sm text-red-600">{error}</p>}
      {!loading && !error && items.length === 0 && <EmptyState title="No communications found" />}
      {!loading && !error && items.length > 0 && <Table columns={COLUMNS} data={items} />}
    </PageContainer>
  );
}

export default Communications;
