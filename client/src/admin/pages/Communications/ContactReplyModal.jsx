import { useMemo, useState } from 'react';
import Modal from '../../../shared/components/common/Modal';
import Button from '../../../shared/components/common/Button';
import { formatDateTime } from '../../../shared/utils/formatters';


export default function ContactReplyModal({ message, isOpen, onClose, onSend }) {
  const channelOptions = useMemo(() => {
    if (!message) return [];
    const opts = [];
    if (message.email) opts.push({ value: 'EMAIL', label: `Email (${message.email})` });
    if (message.phone) opts.push({ value: 'WHATSAPP', label: `WhatsApp (${message.phone})` });
    return opts;
  }, [message]);

  const [channel, setChannel] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);


  const effectiveChannel = channel || channelOptions[0]?.value || '';

  const handleSend = async () => {
    setError(null);
    if (!body.trim()) {
      setError('Please write a reply first.');
      return;
    }
    setSending(true);
    try {
      await onSend({ body: body.trim(), channel: effectiveChannel });
      setBody('');
      setChannel('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to send the reply.');
    } finally {
      setSending(false);
    }
  };

  if (!message) return null;

  const replies = message.replies || [];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reply to ${message.name}`}>
      <div className="space-y-4">
      
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
          <p className="text-xs font-medium text-gray-500">
            {message.subject || 'No subject'} · {formatDateTime(message.createdAt)}
          </p>
          <p className="mt-1 whitespace-pre-line text-sm text-gray-700">{message.message}</p>
        </div>

   
        {replies.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Previous replies</p>
            {replies.map((r) => (
              <div key={r.id} className="rounded-lg border border-[#f5b400]/30 bg-[#f5b400]/5 p-3">
                <p className="text-xs font-medium text-gray-500">
                  {r.channel === 'WHATSAPP' ? 'WhatsApp' : 'Email'} · {formatDateTime(r.createdAt)}
                </p>
                <p className="mt-1 whitespace-pre-line text-sm text-gray-700">{r.body}</p>
              </div>
            ))}
          </div>
        )}

        {channelOptions.length === 0 ? (
          <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
            This message has no email or phone number, so there's no way to reply to it.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="reply-channel" className="text-sm font-medium text-gray-700">
                Send via
              </label>
              <select
                id="reply-channel"
                value={effectiveChannel}
                onChange={(e) => setChannel(e.target.value)}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-[#071525] focus:outline-none focus:ring-1 focus:ring-[#071525]"
              >
                {channelOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              {effectiveChannel === 'WHATSAPP' && (
                <span className="text-xs text-amber-600">
                  WhatsApp sending requires the WhatsApp provider to be configured; otherwise it stays queued.
                </span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="reply-body" className="text-sm font-medium text-gray-700">
                Your reply
              </label>
              <textarea
                id="reply-body"
                rows={5}
                maxLength={4000}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Type your response…"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-[#071525] focus:outline-none focus:ring-1 focus:ring-[#071525]"
              />
            </div>

            {error && <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

            <div className="flex justify-end gap-2 pt-1">
              <Button variant="secondary" onClick={onClose} disabled={sending}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={sending}>
                {sending ? 'Sending…' : 'Send reply'}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
