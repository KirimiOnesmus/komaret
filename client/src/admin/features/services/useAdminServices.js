import { useCallback, useState } from 'react';
import api from '../../../shared/services/api';
import extractList from '../../../shared/utils/api';

const RESOURCE = '/admin/services';


export default function useAdminServices() {
  const [services, setServices] = useState([]);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(RESOURCE, { params });
      setServices(extractList(data));
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load services.');
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
      setService(data);
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load this service.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    const { data } = await api.post(RESOURCE, payload);
    setServices((prev) => [...prev, data]);
    return data;
  }, []);

  const update = useCallback(async (id, payload) => {
    const { data } = await api.patch(`${RESOURCE}/${encodeURIComponent(id)}`, payload);
    setService(data);
    setServices((prev) => prev.map((s) => (s.id === id ? data : s)));
    return data;
  }, []);

  const remove = useCallback(async (id) => {
    await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`);
    setServices((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { services, service, loading, error, fetchList, fetchOne, create, update, remove };
}