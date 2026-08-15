import { useCallback, useEffect, useMemo, useState } from 'react';
import publicService from '../services/publicService';
import extractList from '../utils/api';


export default function useProjects({ slug, params, immediate = true } = {}) {
  const [data, setData] = useState(slug ? null : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const paramsKey = useMemo(() => JSON.stringify(params || {}), [params]);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (slug) {
        const res = await publicService.getProjectBySlug(slug);
        setData(res.data);
      } else {
        const res = await publicService.getProjects(params);
        setData(extractList(res.data));
      }
    } catch (err) {
      setError(err.message || 'Unable to load projects right now.');
    } finally {
      setLoading(false);
    }

  }, [slug, paramsKey]);

  useEffect(() => {

    if (immediate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchProjects();
    }
  }, [fetchProjects, immediate]);

  return { data, loading, error, refetch: fetchProjects };
}