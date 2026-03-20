const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// GET /api/transparency — public, no auth required
router.get('/', async (req, res) => {
  try {
    const { data: complaints, error } = await supabase
      .from('complaints')
      .select(`
        id,
        category,
        text,
        created_at,
        resolved_at,
        replies (
          reply_text,
          sent_at
        )
      `)
      .eq('status', 'Resolved')
      .not('resolved_at', 'is', null)
      .order('resolved_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Process: calculate time_to_resolve & remove student info
    const result = (complaints || []).map((c) => {
      const created = new Date(c.created_at);
      const resolved = new Date(c.resolved_at);
      const timeToResolve = Math.round(((resolved - created) / (1000 * 60 * 60)) * 10) / 10;

      return {
        id: c.id,
        category: c.category,
        text: c.text,
        time_to_resolve: timeToResolve,
        resolved_at: c.resolved_at,
        reply: c.replies && c.replies.length > 0 ? c.replies[0].reply_text : null,
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Transparency error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
