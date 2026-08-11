import { useCallback, useState } from 'react';
import quotationService from '../../../shared/services/quotationService';
import extractList from '../../../shared/utils/api';

export default function useQuotationsList() {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await quotationService.list(params);
      setQuotations(extractList(data));
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load quotations.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { quotations, loading, error, fetchList };
}
