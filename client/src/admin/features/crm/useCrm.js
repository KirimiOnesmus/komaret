import { useCallback, useState } from 'react';
import crmService from '../../../shared/services/crmService';
import extractList from '../../../shared/utils/api';

export default function useCrm() {
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLeads = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await crmService.listLeads(params);
      setLeads(extractList(data));
    } catch (err) {
      setError(err.message || 'Unable to load leads.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClients = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await crmService.listClients(params);
      setClients(extractList(data));
    } catch (err) {
      setError(err.message || 'Unable to load clients.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { leads, clients, loading, error, fetchLeads, fetchClients };
}
