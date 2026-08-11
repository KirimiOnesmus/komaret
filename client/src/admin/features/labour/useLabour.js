import { useCallback, useState } from 'react';
import api from '../../../shared/services/api';
import extractList from '../../../shared/utils/api';

const RESOURCE = '/admin/labour';

export default function useLabour() {
  const [workers, setWorkers] = useState([]);
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

  return { workers, loading, error, fetchList };
}
