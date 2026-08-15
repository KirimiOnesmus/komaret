import { useCallback, useEffect, useState } from 'react';
import quotationService from '../../../shared/services/quotationService';
import extractList from '../../../shared/utils/api';

export default function useQuotation({ id, immediate = Boolean(id) } = {}) {
  const [quotation, setQuotation] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOne = useCallback(async (quotationId = id) => {
    if (!quotationId) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await quotationService.getById(quotationId);
      setQuotation(data);
    } catch (err) {
      setError(err.message || 'Unable to load this quotation.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await quotationService.list(params);
      setList(extractList(data));
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load quotations.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    const { data } = await quotationService.create(payload);
    return data;
  }, []);

  const update = useCallback(async (quotationId, payload) => {
    const { data } = await quotationService.update(quotationId, payload);
    setQuotation(data);
    return data;
  }, []);

  const updateStatus = useCallback(async (quotationId, status) => {
    const { data } = await quotationService.updateStatus(quotationId, status);
    setQuotation(data);
    return data;
  }, []);

  const remove = useCallback(async (quotationId) => {
    await quotationService.remove(quotationId);
  }, []);

  useEffect(() => {

    if (immediate && id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchOne(id);
    }
  }, [immediate, id, fetchOne]);

  return { quotation, list, loading, error, fetchOne, fetchList, create, update, updateStatus, remove };
}