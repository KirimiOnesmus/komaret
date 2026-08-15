import { useCallback, useEffect, useState } from 'react';
import {
  FaPaperPlane,
  FaRedo,
  FaCheck,
  FaInbox,
  FaBell,
} from 'react-icons/fa';

import PageContainer from '../../../shared/components/ui/PageContainer';
import Table from '../../../shared/components/ui/Table';
import Loading from '../../../shared/components/common/Loading';
import EmptyState from '../../../shared/components/common/EmptyState';
import communicationsService from '../../../shared/services/communicationsService';
import { formatDateTime } from '../../../shared/utils/formatters';
import extractList from '../../../shared/utils/api';

const TABS = [
  { key: 'notifications', label: 'Outbound', icon: FaBell },
  { key: 'messages', label: 'Contact Messages', icon: FaInbox },
];

const STATUS_CLASSES = {
  QUEUED: 'bg-gray-100 text-gray-600',
  SENDING: 'bg-blue-50 text-blue-700',
  SENT: 'bg-emerald-50 text-emerald-700',
  FAILED: 'bg-red-50 text-red-700',
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
        STATUS_CLASSES[status] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {status || 'QUEUED'}
    </span>
  );
}

function HandledBadge({ handled }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${
        handled ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {handled ? 'Handled' : 'New'}
    </span>
  );
}

function getRecipientLabel(row) {
  if (row.recipientType === 'CLIENT') return row.client?.name || 'Client';
  if (row.recipientType === 'LABOUR') {
    return row.labour?.name
      ? `${row.labour.name}${row.labour.role ? ` (${row.labour.role})` : ''}`
      : 'Labour';
  }
  return '—';
}

function getNotificationColumns(onRetry, retryingId) {
  return [
    { key: 'recipient', label: 'Recipient', render: (row) => getRecipientLabel(row) },
    { key: 'channel', label: 'Channel' },
    { key: 'templateType', label: 'Template', render: (row) => row.templateType || '—' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
    {
      key: 'sentAt',
      label: 'Sent',
      render: (row) => (row.sentAt ? formatDateTime(row.sentAt) : '—'),
    },
    {
      key: 'actions',
      label: '',
      render: (row) =>
        row.status === 'FAILED' ? (
          <button
            type="button"
            onClick={() => onRetry(row.id)}
            disabled={retryingId === row.id}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaRedo className="text-[10px]" />
            {retryingId === row.id ? 'Retrying…' : 'Retry'}
          </button>
        ) : null,
    },
  ];
}

function getContactMessageColumns(onMarkHandled, updatingId) {
  return [
    { key: 'name', label: 'From', render: (row) => row.name || '—' },
    { key: 'contact', label: 'Contact', render: (row) => row.email || row.phone || '—' },
    { key: 'subject', label: 'Subject', render: (row) => row.subject || '—' },
    {
      key: 'message',
      label: 'Message',
      render: (row) => (
        <span className="line-clamp-2 max-w-xs text-gray-600">{row.message}</span>
      ),
    },
    {
      key: 'createdAt',
      label: 'Received',
      render: (row) => formatDateTime(row.createdAt),
    },
    { key: 'handled', label: 'Status', render: (row) => <HandledBadge handled={row.handled} /> },
    {
      key: 'actions',
      label: '',
      render: (row) =>
        row.handled ? null : (
          <button
            type="button"
            onClick={() => onMarkHandled(row.id)}
            disabled={updatingId === row.id}
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 transition-colors hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaCheck className="text-[10px]" />
            {updatingId === row.id ? 'Saving…' : 'Mark handled'}
          </button>
        ),
    },
  ];
}

function Communications() {
  const [tab, setTab] = useState('notifications');

  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dispatching, setDispatching] = useState(false);
  const [retryingId, setRetryingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await communicationsService.list();
      setNotifications(extractList(data));
    } catch (err) {
      setError(err.message || 'Unable to load communications.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await communicationsService.listContactMessages();
      setMessages(extractList(data));
    } catch (err) {
      setError(err.message || 'Unable to load contact messages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === 'notifications') {
      fetchNotifications();
    } else {
      fetchMessages();
    }
  }, [tab, fetchNotifications, fetchMessages]);

  const handleDispatch = async () => {
    setDispatching(true);
    setActionError(null);
    try {
      await communicationsService.dispatch();
      await fetchNotifications();
    } catch (err) {
      setActionError(err.message || 'Unable to dispatch the queue.');
    } finally {
      setDispatching(false);
    }
  };

  const handleRetry = async (id) => {
    setRetryingId(id);
    setActionError(null);
    try {
      await communicationsService.retry(id);
      await fetchNotifications();
    } catch (err) {
      setActionError(err.message || 'Unable to retry this notification.');
    } finally {
      setRetryingId(null);
    }
  };

  const handleMarkHandled = async (id) => {
    setUpdatingId(id);
    setActionError(null);
    try {
      await communicationsService.markContactMessageHandled(id, true);
      await fetchMessages();
    } catch (err) {
      setActionError(err.message || 'Unable to update this message.');
    } finally {
      setUpdatingId(null);
    }
  };

  const notificationRows = Array.isArray(notifications) ? notifications : [];
  const messageRows = Array.isArray(messages) ? messages : [];
  const rows = tab === 'notifications' ? notificationRows : messageRows;
  const columns =
    tab === 'notifications'
      ? getNotificationColumns(handleRetry, retryingId)
      : getContactMessageColumns(handleMarkHandled, updatingId);

  const failedCount = notificationRows.filter((row) => row.status === 'FAILED').length;
  const newMessageCount = messageRows.filter((row) => !row.handled).length;

  return (
    <PageContainer
      title="Communications"
      description="Outbound WhatsApp and email notifications, plus inbound messages from the website contact form."
      actions={
        tab === 'notifications' ? (
          <button
            type="button"
            onClick={handleDispatch}
            disabled={dispatching}
            className="flex items-center gap-2 rounded-xl bg-[#f5b400] px-5 py-2.5 text-sm font-semibold text-[#071525] transition-colors hover:bg-[#e0a600] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FaPaperPlane className="text-xs" />
            {dispatching ? 'Dispatching…' : 'Dispatch queue'}
          </button>
        ) : null
      }
    >
      <div className="mb-6 flex items-center gap-1 border-b border-gray-200">
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.key;
          const count = item.key === 'notifications' ? notificationRows.length : messageRows.length;

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`relative flex items-center gap-2 px-4 pb-3 pt-1 text-sm font-semibold transition-colors ${
                active ? 'text-[#071525]' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <Icon className={active ? 'text-[#f5b400]' : 'text-gray-400'} />
              {item.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  active ? 'bg-[#f5b400]/10 text-[#071525]' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {count}
              </span>
              {active && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#f5b400]" />}
            </button>
          );
        })}
      </div>

      {actionError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-700">{actionError}</p>
        </div>
      )}

      {!loading && !error && tab === 'notifications' && failedCount > 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            {failedCount} notification{failedCount === 1 ? '' : 's'} failed to send. Retry them below.
          </p>
        </div>
      )}

      {!loading && !error && tab === 'messages' && newMessageCount > 0 && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">
            {newMessageCount} new message{newMessageCount === 1 ? '' : 's'} from the contact form.
          </p>
        </div>
      )}

      {loading && <Loading label={tab === 'notifications' ? 'Loading communications...' : 'Loading messages...'} />}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && rows.length === 0 && (
        <EmptyState
          title={tab === 'notifications' ? 'No communications found' : 'No contact messages yet'}
          message={
            tab === 'notifications'
              ? 'Notifications will appear here once messages are queued.'
              : 'Submissions from the website contact form will appear here.'
          }
        />
      )}

      {!loading && !error && rows.length > 0 && <Table columns={columns} data={rows} />}
    </PageContainer>
  );
}

export default Communications;