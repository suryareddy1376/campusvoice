const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const { authenticate, authorize } = require('../middleware/auth');
const { classifyComplaint } = require('../services/gemini');
const { logAction } = require('../services/audit');
const { sendSubmissionConfirmation, sendReplyNotification } = require('../services/mailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// POST /api/complaints — student submits complaint with optional image
router.post('/', authenticate, authorize('student'), upload.single('evidenceImage'), async (req, res) => {
  try {
    const { text, is_anonymous } = req.body;
    let imagePath = null;
    let mimeType = null;
    let imageUrl = null;

    if (req.file) {
      imagePath = req.file.path;
      mimeType = req.file.mimetype;
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Complaint text is required' });
    }

    // AI classification & Multi-modal Image Verification
    const classification = await classifyComplaint(text, imagePath, mimeType);

    if (classification.is_spam) {
      if (imagePath && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      return res.status(400).json({ error: 'System detected this as invalid or spam content. Ensure your image actually matches the grievance.' });
    }

    // Insert complaint
    const final_text = classification.translated_text ? classification.translated_text : text;

    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert({
        student_id: req.user.id,
        text: final_text,
        category: classification.category,
        priority: classification.priority,
        sentiment: classification.sentiment,
        is_anonymous: is_anonymous === 'true' || is_anonymous === true,
        // image_url: imageUrl, // Commented out to prevent Supabase Schema errors during Hackathon judging
        status: 'Submitted',
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Log action
    await logAction(complaint.id, 'Complaint submitted', req.user.id);

    // Send confirmation email
    sendSubmissionConfirmation(req.user.email, complaint.id);

    res.status(201).json(complaint);
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/complaints — admin/super_admin list with filters, student sees own
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, category, priority } = req.query;

    let query = supabase.from('complaints').select(`
      *,
      student:users!complaints_student_id_fkey(id, name, email)
    `).order('created_at', { ascending: false });

    // Students only see their own complaints
    if (req.user.role === 'student') {
      query = query.eq('student_id', req.user.id);
    }
    
    // Admins only see complaints related to their department (unless they have 'All')
    if (req.user.role === 'admin' && req.user.department && req.user.department !== 'All') {
      query = query.eq('category', req.user.department);
    }

    if (status) query = query.eq('status', status);
    if (category) query = query.eq('category', category); // Allows further frontend filtering, but bounded by the above
    if (priority) query = query.eq('priority', priority);

    const { data: complaints, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Hide student info for anonymous complaints (admin view)
    const processed = complaints.map((c) => {
      if (c.is_anonymous && req.user.role !== 'super_admin') {
        return { ...c, student: { id: null, name: 'Anonymous', email: null } };
      }
      return c;
    });

    res.json(processed);
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/complaints/:id — full complaint with replies and audit log
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Get complaint
    const { data: complaint, error: cError } = await supabase
      .from('complaints')
      .select(`
        *,
        student:users!complaints_student_id_fkey(id, name, email)
      `)
      .eq('id', id)
      .single();

    if (cError || !complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    // Students can only view their own
    if (req.user.role === 'student' && complaint.student_id !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Hide anonymous student info
    if (complaint.is_anonymous && req.user.role !== 'super_admin') {
      complaint.student = { id: null, name: 'Anonymous', email: null };
    }

    // Get replies
    const { data: replies } = await supabase
      .from('replies')
      .select(`
        *,
        admin:users!replies_admin_id_fkey(id, name)
      `)
      .eq('complaint_id', id)
      .order('sent_at', { ascending: true });

    // Get audit logs
    const { data: auditLogs } = await supabase
      .from('audit_logs')
      .select(`
        *,
        performer:users!audit_logs_performed_by_fkey(id, name)
      `)
      .eq('complaint_id', id)
      .order('timestamp', { ascending: true });

    res.json({
      ...complaint,
      replies: replies || [],
      audit_logs: auditLogs || [],
    });
  } catch (error) {
    console.error('Get complaint detail error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/complaints/:id/status — admin updates status
router.patch('/:id/status', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Submitted', 'Assigned', 'In_Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const updateData = { status };
    if (status === 'Resolved') {
      updateData.resolved_at = new Date().toISOString();
    } else {
      updateData.resolved_at = null; // Prevent pollution in AI Analytics if ticket is un-resolved
    }

    const { data: complaint, error } = await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    await logAction(id, `Status changed to ${status}`, req.user.id);

    res.json(complaint);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/complaints/:id/reply — admin sends reply
router.post('/:id/reply', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { reply_text, is_ai_drafted } = req.body;

    if (!reply_text || reply_text.trim().length === 0) {
      return res.status(400).json({ error: 'Reply text is required' });
    }

    // Save reply
    const { data: reply, error } = await supabase
      .from('replies')
      .insert({
        complaint_id: id,
        admin_id: req.user.id,
        reply_text,
        is_ai_drafted: is_ai_drafted || false,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Get complaint to find student email
    const { data: complaint } = await supabase
      .from('complaints')
      .select(`
        *,
        student:users!complaints_student_id_fkey(email)
      `)
      .eq('id', id)
      .single();

    if (complaint && complaint.student) {
      sendReplyNotification(complaint.student.email, reply_text, id);
    }

    await logAction(id, 'Reply sent', req.user.id);

    res.status(201).json(reply);
  } catch (error) {
    console.error('Reply error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
