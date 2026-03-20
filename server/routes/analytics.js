const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const { authenticate, authorize } = require('../middleware/auth');
const { generatePredictions } = require('../services/gemini');

// GET /api/analytics/summary
router.get('/summary', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    // Base queries
    let totalQuery = supabase.from('complaints').select('*', { count: 'exact', head: true });
    let resolvedQuery = supabase.from('complaints').select('*', { count: 'exact', head: true }).eq('status', 'Resolved');

    // Admin Category Filter
    if (req.user.role === 'admin' && req.user.department && req.user.department !== 'All') {
      totalQuery = totalQuery.eq('category', req.user.department);
      resolvedQuery = resolvedQuery.eq('category', req.user.department);
    }

    // Total complaints
    const { count: total } = await totalQuery;

    // Resolved complaints
    const { count: resolved } = await resolvedQuery;

    // Pending (all non-resolved)
    const pending = total - resolved;

    // Average resolution time
    let avgResQuery = supabase
      .from('complaints')
      .select('created_at, resolved_at')
      .eq('status', 'Resolved')
      .not('resolved_at', 'is', null);

    if (req.user.role === 'admin' && req.user.department && req.user.department !== 'All') {
      avgResQuery = avgResQuery.eq('category', req.user.department);
    }
      
    const { data: resolvedComplaints } = await avgResQuery;

    let avgResolutionTime = 0;
    if (resolvedComplaints && resolvedComplaints.length > 0) {
      const totalHours = resolvedComplaints.reduce((sum, c) => {
        const created = new Date(c.created_at);
        const resolved = new Date(c.resolved_at);
        return sum + (resolved - created) / (1000 * 60 * 60);
      }, 0);
      avgResolutionTime = Math.round((totalHours / resolvedComplaints.length) * 10) / 10;
    }

    res.json({ total, resolved, pending, avgResolutionTime });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/analytics/categories
router.get('/categories', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    let query = supabase.from('complaints').select('category');
    
    if (req.user.role === 'admin' && req.user.department && req.user.department !== 'All') {
      query = query.eq('category', req.user.department);
    }

    const { data: complaints } = await query;

    const counts = {};
    (complaints || []).forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });

    const result = Object.entries(counts).map(([category, count]) => ({
      category,
      count,
    }));

    res.json(result);
  } catch (error) {
    console.error('Analytics categories error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/analytics/resolution-time
router.get('/resolution-time', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    let query = supabase
      .from('complaints')
      .select('category, created_at, resolved_at')
      .eq('status', 'Resolved')
      .not('resolved_at', 'is', null);

    if (req.user.role === 'admin' && req.user.department && req.user.department !== 'All') {
      query = query.eq('category', req.user.department);
    }

    const { data: resolvedComplaints } = await query;

    const categoryTimes = {};
    (resolvedComplaints || []).forEach((c) => {
      const hours = (new Date(c.resolved_at) - new Date(c.created_at)) / (1000 * 60 * 60);
      if (!categoryTimes[c.category]) {
        categoryTimes[c.category] = { total: 0, count: 0 };
      }
      categoryTimes[c.category].total += hours;
      categoryTimes[c.category].count += 1;
    });

    const result = Object.entries(categoryTimes).map(([category, data]) => ({
      category,
      avgResolutionTime: Math.round((data.total / data.count) * 10) / 10,
    }));

    res.json(result);
  } catch (error) {
    console.error('Analytics resolution time error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/analytics/predictions — AI forecasts based on history
router.get('/predictions', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    let query = supabase
      .from('complaints')
      .select('category, priority, text, created_at')
      .order('created_at', { ascending: false })
      .limit(50); // Send the latest 50 complaints for contextual analysis

    // Enforce Admin Boundaries
    if (req.user.role === 'admin' && req.user.department !== 'All') {
      query = query.eq('category', req.user.department);
    }

    const { data: recentComplaints, error } = await query;
    if (error) throw error;

    if (!recentComplaints || recentComplaints.length === 0) {
      return res.json({ prediction: "Not enough historical data to generate reliable predictions. Check back once more grievances are recorded." });
    }

    const predictionText = await generatePredictions(recentComplaints, req.user.department || 'All');
    res.json({ prediction: predictionText });
  } catch (error) {
    console.error('Analytics predictions error:', error);
    res.status(500).json({ error: 'Failed to generate predictions' });
  }
});

module.exports = router;
