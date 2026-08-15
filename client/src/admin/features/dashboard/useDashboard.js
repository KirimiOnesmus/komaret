import { useCallback, useEffect, useState } from 'react';
import reportsService from '../../../shared/services/reportsService';


export default function useDashboard() {
  const [summary, setSummary] = useState(null);
  const [projects, setProjects] = useState(null);
  const [quotations, setQuotations] = useState(null);
  const [crm, setCrm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [d, p, q, c] = await Promise.allSettled([
      reportsService.get('dashboard'),
      reportsService.get('projects'),
      reportsService.get('quotations'),
      reportsService.get('crm'),
    ]);

    if (d.status === 'rejected') {
      setError(d.reason?.message || 'Unable to load the dashboard right now.');
      setLoading(false);
      return;
    }

    setSummary(d.value.data);
    setProjects(p.status === 'fulfilled' ? p.value.data : null);
    setQuotations(q.status === 'fulfilled' ? q.value.data : null);
    setCrm(c.status === 'fulfilled' ? c.value.data : null);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { summary, projects, quotations, crm, loading, error, refresh };
}