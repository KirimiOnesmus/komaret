import { useCallback, useEffect, useState } from 'react';
import api from '../../../shared/services/api';
import extractList from '../../../shared/utils/api';

const RESOURCE = '/admin/categories';


export default function useAdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(RESOURCE);
      setCategories(extractList(data));
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load categories.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchList().catch(() => {});
  }, [fetchList]);

  return { categories, loading, error, refetch: fetchList };
}
