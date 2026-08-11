import { useCallback, useEffect, useMemo, useState } from 'react';
import publicService from '../services/publicService';
import extractList from '../utils/api';

/**
 * Fetches the public service catalog (or a single service by slug).
 * Read-only, unauthenticated data — errors are shown generically since
 * this hook is used on public marketing pages.
 */
export default function useServices({ slug, params, immediate = true } = {}) {
  const [data, setData] = useState(slug ? null : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const paramsKey = useMemo(() => JSON.stringify(params || {}), [params]);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (slug) {
        const res = await publicService.getServiceBySlug(slug);
        setData(res.data);
      } else {
        const res = await publicService.getServices(params);
        setData(extractList(res.data));
      }
    } catch (err) {
      setError(err.message || 'Unable to load services right now.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, paramsKey]);

  useEffect(() => {
    // Intentional: this hook exists to fetch on mount when `immediate`
    // is set; `fetchServices` guards its own loading/error state.
    if (immediate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchServices();
    }
  }, [fetchServices, immediate]);

  return { data, loading, error, refetch: fetchServices };
}
