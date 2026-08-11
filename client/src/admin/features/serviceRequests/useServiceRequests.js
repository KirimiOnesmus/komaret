import { useCallback, useState } from 'react';
import serviceRequestService from '../../../shared/services/serviceRequestService';
import extractList from '../../../shared/utils/api';

export default function useServiceRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await serviceRequestService.list(params);
      setRequests(extractList(data));
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load service requests.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const { data } = await serviceRequestService.updateStatus(id, status);
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: data.status } : r)));
    return data;
  }, []);

  return { requests, loading, error, fetchList, updateStatus };
}
