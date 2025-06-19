import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export default function useAnnotations(bookId) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from server
  useEffect(() => {
    if (!bookId) return;
    let cancelled = false;

    (async () => {
      try {
        const { data } = await axios.get('/api/annotations', { params: { bookId } });
        if (!cancelled) setList(data);
      } catch (err) {
        console.error('Error fetching annotations:', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [bookId]);

  // Add annotation
  const add = useCallback(async (payload) => {
    const optimistic = { ...payload, _id: crypto.randomUUID() };
    setList(prev => [...prev, optimistic]);

    try {
      const { data: saved } = await axios.post('/api/annotations', payload);
      setList(prev => prev.map(a => a._id === optimistic._id ? saved : a));
    } catch (err) {
      console.error('Save failed:', err);
      setList(prev => prev.filter(a => a._id !== optimistic._id));
    }
  }, []);

  // Update annotation
  const update = useCallback(async (id, changes) => {
    setList(prev => prev.map(a => a._id === id ? { ...a, ...changes } : a));
    try {
      await axios.put(`/api/annotations/${id}`, changes);
    } catch (err) {
      console.error('Update failed:', err);
    }
  }, []);

 
    const remove = useCallback(async (id) => {

    setList(prev => prev.filter(a => a._id !== id));

    try {
      await axios.delete(`/api/annotations/${id}`);
    } catch (err) {
      console.error('Delete failed:', err);
      // for later refetch or rollback 
    }
  }, []);
  
 return { list, add, update, remove, loading };

}
