const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const { authenticate, authorize } = require('../middleware/auth');
const { suggestReply } = require('../services/gemini');

// POST /api/ai/suggest-reply — Gemini drafts a reply
router.post('/suggest-reply', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { complaint_id } = req.body;

    if (!complaint_id) {
      return res.status(400).json({ error: 'complaint_id is required' });
    }

    // Fetch complaint
    const { data: complaint, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', complaint_id)
      .single();

    if (error || !complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Get AI-suggested reply
    const draft = await suggestReply(complaint.text, complaint.category, complaint.priority);

    res.json({ draft });
  } catch (error) {
    console.error('AI suggest reply error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
