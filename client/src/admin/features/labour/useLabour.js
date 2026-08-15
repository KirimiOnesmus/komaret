import { useCallback, useState } from 'react';
import api from '../../../shared/services/api';
import extractList from '../../../shared/utils/api';

const RESOURCE = '/admin/labour';

export default function useLabour() {
  const [workers, setWorkers] = useState([]);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(RESOURCE, { params });
      setWorkers(extractList(data));
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load labour records.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOne = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`${RESOURCE}/${encodeURIComponent(id)}`);
      setWorker(data);
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load this worker.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    const { data } = await api.post(RESOURCE, payload);
    return data;
  }, []);

  const update = useCallback(async (id, payload) => {
    const { data } = await api.patch(`${RESOURCE}/${encodeURIComponent(id)}`, payload);
    setWorker(data);
    setWorkers((prev) => prev.map((w) => (w.id === id ? data : w)));
    return data;
  }, []);

  const remove = useCallback(async (id) => {
    await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`);
    setWorkers((prev) => prev.filter((w) => w.id !== id));
  }, []);

  return { workers, worker, loading, error, fetchList, fetchOne, create, update, remove };
}