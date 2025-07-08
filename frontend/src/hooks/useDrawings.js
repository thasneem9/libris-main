// hooks/useDrawings.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useDrawings(bookId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookId) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await axios.get('/api/drawings', { params: { bookId } });
        if (!cancelled) setData(res.data);
      } catch (err) {
        console.error('Error fetching drawings:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [bookId]);

  const add = useCallback(async (stroke) => {
    const tempId = crypto.randomUUID();
    const optimistic = { ...stroke, _id: tempId };
    setData(prev => [...prev, optimistic]);
    try {
      const res = await axios.post('/api/drawings', stroke);
      setData(prev => prev.map(s => s.id === tempId ? res.data : s));
    } catch (err) {
      setData(prev => prev.filter(s => s.id !== tempId));
      console.error('Drawing save failed:', err);
    }
  }, []);

  const remove = useCallback(async (id) => {
    setData(prev => prev.filter(s => s.id !== id));
    try {
      await axios.delete(`/api/drawings/${id}`);
    } catch (err) {
      console.error('Drawing delete failed:', err);
    }
  }, []);

  return { data, add, remove, loading };
}
