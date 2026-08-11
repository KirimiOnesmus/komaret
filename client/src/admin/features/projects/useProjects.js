import { useCallback, useState } from 'react';
import projectService from '../../../shared/services/projectService';
import extractList from '../../../shared/utils/api';
export default function useProjects() {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchList = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await projectService.list(params);
      setProjects(extractList(data));
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load projects.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOne = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await projectService.getById(id);
      setProject(data);
      return data;
    } catch (err) {
      setError(err.message || 'Unable to load this project.');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (payload) => {
    const { data } = await projectService.create(payload);
    return data;
  }, []);

  const update = useCallback(async (id, payload) => {
    const { data } = await projectService.update(id, payload);
    setProject(data);
    return data;
  }, []);

  const remove = useCallback(async (id) => {
    await projectService.remove(id);
  }, []);

  return { projects, project, loading, error, fetchList, fetchOne, create, update, remove };
}
