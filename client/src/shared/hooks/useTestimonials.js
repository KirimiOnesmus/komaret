import { useEffect, useState } from 'react';
import publicService from '../services/publicService';
import extractList from '../utils/api';


export default function useTestimonials() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    publicService
      .getTestimonials()
      .then((res) => {
        if (active) setData(extractList(res.data));
      })
      .catch((err) => {
        if (active) setError(err.message || 'Unable to load testimonials.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
}
