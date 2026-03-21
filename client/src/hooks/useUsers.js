import { useState, useCallback } from 'react';
import api from '../utils/api';

export function useUsers() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/users/admins');
      setAdmins(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAdmin = async (name, email, password, department, level = 1) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post('/users/admin', { name, email, password, department, level });
      setAdmins((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to create admin';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/users/admin/${id}`);
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to delete admin';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return {
    admins,
    loading,
    error,
    fetchAdmins,
    createAdmin,
    deleteAdmin,
  };
}
