import { useCallback, useState } from 'react';
import api from '../../../shared/services/api';
import extractList from '../../../shared/utils/api';

const RESOURCE = '/admin/machinery';

export default function useMachinery() {
  const [machines, setMachines] = useState([]);
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(RESOURCE, { params });
      setMachines(extractList(data));
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load machinery.');
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
      setMachine(data);
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load this machine.');
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
    setMachine(data);
    setMachines((prev) => prev.map((m) => (m.id === id ? data : m)));
    return data;
  }, []);

  const remove = useCallback(async (id) => {
    await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`);
    setMachines((prev) => prev.filter((m) => m.id !== id));
  }, []);

  return { machines, machine, loading, error, fetchList, fetchOne, create, update, remove };
}