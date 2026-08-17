import { useCallback, useState } from 'react';
import api from '../../../shared/services/api';
import extractList from '../../../shared/utils/api';

const RESOURCE = '/admin/news';

export default function useAdminNews() {
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(RESOURCE, { params });
      setArticles(extractList(data));
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load news.');
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
      setArticle(data);
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load this article.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    const { data } = await api.post(RESOURCE, payload);
    setArticles((prev) => [data, ...prev]);
    return data;
  }, []);

  const update = useCallback(async (id, payload) => {
    const { data } = await api.patch(`${RESOURCE}/${encodeURIComponent(id)}`, payload);
    setArticle(data);
    setArticles((prev) => prev.map((a) => (a.id === id ? data : a)));
    return data;
  }, []);

  const remove = useCallback(async (id) => {
    await api.delete(`${RESOURCE}/${encodeURIComponent(id)}`);
    setArticles((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const uploadImage = useCallback(async (id, file) => {
    const fd = new FormData();
    fd.append('image', file);
    const { data } = await api.post(`${RESOURCE}/${encodeURIComponent(id)}/image`, fd, {
      headers: { 'Content-Type': undefined },
    });
    setArticle((prev) => (prev && prev.id === id ? { ...prev, image: data.image } : prev));
    return data;
  }, []);

  const removeImage = useCallback(async (id) => {
    const { data } = await api.delete(`${RESOURCE}/${encodeURIComponent(id)}/image`);
    setArticle((prev) => (prev && prev.id === id ? { ...prev, image: null } : prev));
    return data;
  }, []);

  return { articles, article, loading, error, fetchList, fetchOne, create, update, remove, uploadImage, removeImage };
}

export const NEWS_CATEGORY_OPTIONS = [
  { value: 'COMPANY_UPDATES', label: 'Company Updates' },
  { value: 'INDUSTRY_INSIGHTS', label: 'Industry Insights' },
];
