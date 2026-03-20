import { useState, useCallback } from 'react';
import api from '../utils/api';

export function useComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchComplaints = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);

      const { data } = await api.get(`/complaints?${params.toString()}`);
      setComplaints(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchComplaint = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/complaints/${id}`);
      setComplaint(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch complaint');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitComplaint = useCallback(async (text, is_anonymous = false, imageFile = null) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('is_anonymous', is_anonymous);
      if (imageFile) {
        formData.append('evidenceImage', imageFile);
      }

      const { data } = await api.post('/complaints', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setComplaints((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit complaint';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    try {
      const { data } = await api.patch(`/complaints/${id}/status`, { status });
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...data } : c))
      );
      if (complaint && complaint.id === id) {
        setComplaint((prev) => ({ ...prev, ...data }));
      }
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to update status');
    }
  }, [complaint]);

  const sendReply = useCallback(async (id, reply_text, is_ai_drafted = false) => {
    try {
      const { data } = await api.post(`/complaints/${id}/reply`, {
        reply_text,
        is_ai_drafted,
      });
      if (complaint && complaint.id === id) {
        setComplaint((prev) => ({
          ...prev,
          replies: [...(prev.replies || []), data],
        }));
      }
      return data;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to send reply');
    }
  }, [complaint]);

  const suggestReply = useCallback(async (complaint_id) => {
    try {
      const { data } = await api.post('/ai/suggest-reply', { complaint_id });
      return data.draft;
    } catch (err) {
      throw new Error(err.response?.data?.error || 'Failed to generate AI reply');
    }
  }, []);

  return {
    complaints,
    complaint,
    loading,
    error,
    fetchComplaints,
    fetchComplaint,
    submitComplaint,
    updateStatus,
    sendReply,
    suggestReply,
  };
}
