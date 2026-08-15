import { useCallback, useEffect, useMemo, useState } from 'react';
import publicService from '../services/publicService';
import extractList from '../utils/api';

/**
 * Fetches the public service categories (or a single category by slug).
 * Categories are the first-class grouping the header, footer, home grid and
 * services-page filter run on. Read-only, unauthenticated data.
 */
export default function useCategories({ slug, params, immediate = true } = {}) {
  const [data, setData] = useState(slug ? null : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const paramsKey = useMemo(() => JSON.stringify(params || {}), [params]);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (slug) {
        const res = await publicService.getCategoryBySlug(slug);
        setData(res.data);
      } else {
        const res = await publicService.getCategories(params);
        setData(extractList(res.data));
      }
    } catch (err) {
      setError(err.message || 'Unable to load categories right now.');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, paramsKey]);

  useEffect(() => {
    if (immediate) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchCategories();
    }
  }, [fetchCategories, immediate]);

  return { data, loading, error, refetch: fetchCategories };
}
