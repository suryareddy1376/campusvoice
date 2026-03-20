import { useState, useCallback } from 'react';
import api from '../utils/api';

export function useAnalytics() {
  const [summary, setSummary] = useState(null);
  const [categories, setCategories] = useState([]);
  const [resolutionTime, setResolutionTime] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/analytics/summary');
      setSummary(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch summary');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await api.get('/analytics/categories');
      setCategories(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch categories');
    }
  }, []);

  const fetchResolutionTime = useCallback(async () => {
    try {
      const { data } = await api.get('/analytics/resolution-time');
      setResolutionTime(data);
      return data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch resolution time');
    }
  }, []);

  const fetchPredictions = useCallback(async () => {
    setLoadingPredictions(true);
    try {
      const { data } = await api.get('/analytics/predictions');
      setPredictions(data.prediction);
      return data.prediction;
    } catch (err) {
      console.error('Failed to fetch predictions', err);
      // Don't override main error state, just return null or handle locally
      return null;
    } finally {
      setLoadingPredictions(false);
    }
  }, []);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchSummary(), fetchCategories(), fetchResolutionTime()]);
    } finally {
      setLoading(false);
    }
  }, [fetchSummary, fetchCategories, fetchResolutionTime]);

  return {
    summary,
    categories,
    resolutionTime,
    predictions,
    loading,
    loadingPredictions,
    error,
    fetchSummary,
    fetchCategories,
    fetchResolutionTime,
    fetchPredictions,
    fetchAll,
  };
}
