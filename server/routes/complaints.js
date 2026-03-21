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

function getEscalationDeadline(department, level) {
  if (department === 'Emergency') {
    return new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  }
  if (level === 1) {
    return new Date(Date.now() + 48 * 60 * 60 * 1000);
  }
  if (level === 2) {
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }
  return null;
}

const EMERGENCY_KEYWORDS = [
  'emergency', 'medical emergency', 'fire', 'flood', 'unconscious', 'accident', 
  'ambulance', 'severe injury', 'bleeding', 'fainted', 'collapsed', 'not breathing', 
  'chest pain', 'violent assault', 'physical assault', 'sexual assault', 
  'ragging violence', 'weapon threat', 'gas leak', 'electric shock', 'drowning', 
  'suicide attempt', 'self harm', 'building fire', 'serious accident', 'head injury'
];

function isEmergency(text) {
  const lowerText = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lowerText.includes(kw));
}

// POST /api/complaints — student submits complaint with optional image
router.post('/', authenticate, authorize('student'), upload.single('evidenceImage'), async (req, res) => {
  try {
    const { text, is_anonymous } = req.body;
    let imagePath = null;
    let mimeType = null;
    // let imageUrl = null;

    if (req.file) {
      imagePath = req.file.path;
      mimeType = req.file.mimetype;
      // imageUrl = `/uploads/${req.file.filename}`;
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

    const final_text = classification.translated_text ? classification.translated_text : text;
    
    // Check Emergency
    let department = classification.category;
    let initialStatus = 'Submitted';
    let escalationLevel = 1;

    if (isEmergency(final_text)) {
      department = 'Emergency';
      escalationLevel = 1; // Start at Level 1 for Emergency Response Team (cron escalates to 3 after 4h)
    }

    // Insert complaint
    const insertPayload = {
        student_id: req.user.id,
        text: final_text,
        category: classification.category, // keep original category for analytics
        department: department,
        priority: department === 'Emergency' ? 'High' : classification.priority,
        sentiment: classification.sentiment,
        is_anonymous: is_anonymous === 'true' || is_anonymous === true,
        status: 'Submitted', // Start as Submitted even for Emergency
        escalation_level: escalationLevel,
      };

    const { data: complaint, error } = await supabase
      .from('complaints')
      .insert(insertPayload)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Set escalation deadline and assigned_to
    const deadline = getEscalationDeadline(department, 1);
    const updatePayload = { escalation_deadline: deadline };

    if (department === 'Emergency') {
      // Find Emergency Admin to assign it to first
      const { data: emergencyAdmin } = await supabase
        .from('department_admins')
        .select('user_id')
        .eq('department', 'Emergency')
        .limit(1)
        .single();
        
      if (emergencyAdmin) {
        updatePayload.assigned_to = emergencyAdmin.user_id;
      }
    }

    await supabase
      .from('complaints')
      .update(updatePayload)
      .eq('id', complaint.id);

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

async function getVisibleComplaints(userId, userRole) {
  if (userRole === 'student') {
    return supabase
      .from('complaints')
      .select('*, student:users!complaints_student_id_fkey(id, name, email)')
      .eq('student_id', userId)
      .order('created_at', { ascending: false });
  }

  if (userRole === 'super_admin') {
    return supabase
      .from('complaints')
      .select('*, student:users!complaints_student_id_fkey(id, name, email)')
      .order('created_at', { ascending: false });
  }

  if (userRole === 'admin') {
    const { data: deptAdmin } = await supabase
      .from('department_admins')
      .select('department, level')
      .eq('user_id', userId)
      .single();

    if (!deptAdmin) {
        // Return a query that yields empty if not found
        return supabase.from('complaints').select('*, student:users!complaints_student_id_fkey(id, name, email)').eq('id', '00000000-0000-0000-0000-000000000000');
    }

    if (deptAdmin.level === 3 || deptAdmin.department === 'All') {
      return supabase
        .from('complaints')
        .select('*, student:users!complaints_student_id_fkey(id, name, email)')
        .order('created_at', { ascending: false });
    }

    if (deptAdmin.level === 2) {
      return supabase
        .from('complaints')
        .select('*, student:users!complaints_student_id_fkey(id, name, email)')
        .eq('department', deptAdmin.department)
        .order('created_at', { ascending: false });
    }

    if (deptAdmin.level === 1) {
      return supabase
        .from('complaints')
        .select('*, student:users!complaints_student_id_fkey(id, name, email)')
        .eq('department', deptAdmin.department)
        .in('escalation_level', [1])
        .order('created_at', { ascending: false });
    }
  }
}

// GET /api/complaints — admin/super_admin list with filters, student sees own
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, priority, department, escalation_level } = req.query;

    let query = await getVisibleComplaints(req.user.id, req.user.role);

    if (status) query = query.eq('status', status);
    if (priority) query = query.eq('priority', priority);
    if (department) query = query.eq('department', department);
    if (escalation_level) query = query.eq('escalation_level', parseInt(escalation_level));

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

// GET /api/complaints/escalated
// Returns all complaints currently at HOD or Chairman level for the logged-in user's visibility scope
router.get('/escalated', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    let query = await getVisibleComplaints(req.user.id, req.user.role);
    query = query.in('escalation_level', [2, 3]);

    const { data: complaints, error } = await query;
    if (error) return res.status(400).json({ error: error.message });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/complaints/emergency
// Returns all active emergency complaints — admin and super_admin only
router.get('/emergency', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    let query = await getVisibleComplaints(req.user.id, req.user.role);
    query = query.eq('department', 'Emergency');

    const { data: complaints, error } = await query;
    if (error) return res.status(400).json({ error: error.message });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/complaints/:id/escalation-history
// Returns full escalation trail from audit_logs for a complaint
router.get('/:id/escalation-history', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { data: auditLogs, error } = await supabase
      .from('audit_logs')
      .select('*, performer:users!audit_logs_performed_by_fkey(id, name)')
      .eq('complaint_id', id)
      .like('action', '%Escalated%')
      .order('timestamp', { ascending: true });

    if (error) return res.status(400).json({ error: error.message });
    res.json(auditLogs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/complaints/:id/manual-escalate
// Admin can manually escalate before deadline
router.post('/:id/manual-escalate', authenticate, authorize('admin', 'super_admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, escalate_to } = req.body;

    if (!['HOD', 'Chairman'].includes(escalate_to)) {
      return res.status(400).json({ error: 'Invalid escalate_to value' });
    }

    const { data: complaint, error: fetchError } = await supabase
      .from('complaints')
      .select('*, student:users!complaints_student_id_fkey(email)')
      .eq('id', id)
      .single();

    if (fetchError || !complaint) return res.status(404).json({ error: 'Complaint not found' });

    let targetLevel = escalate_to === 'HOD' ? 2 : 3;
    let assignedUserId = null;
    let targetEmail = null;

    // Find the target admin
    let adminQuery = supabase.from('department_admins').select('user_id, users(email)').eq('level', targetLevel);
    if (targetLevel === 2) {
      adminQuery = adminQuery.eq('department', complaint.department);
    }
    const { data: targetAdmin } = await adminQuery.limit(1).single();

    if (targetAdmin) {
      assignedUserId = targetAdmin.user_id;
      if (targetAdmin.users) targetEmail = targetAdmin.users.email;
    }

    const { data: updatedComplaint, error: updateError } = await supabase
      .from('complaints')
      .update({
        escalation_level: targetLevel,
        status: `Escalated_To_${escalate_to}`,
        assigned_to: assignedUserId,
        escalated_at: new Date().toISOString(),
        escalation_deadline: targetLevel === 2 ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) return res.status(400).json({ error: updateError.message });

    await logAction(id, `Manually Escalated_To_${escalate_to}. Reason: ${reason}`, req.user.id);

    // Call mailers (will implement them in mailer.js soon)
    const { escalationToHOD, escalationToChairman, studentEscalationNotice } = require('../services/mailer');
    
    if (targetEmail) {
      if (escalate_to === 'HOD') escalationToHOD(targetEmail, updatedComplaint);
      if (escalate_to === 'Chairman') escalationToChairman(targetEmail, updatedComplaint);
    }
    
    if (complaint.student && complaint.student.email) {
      studentEscalationNotice(complaint.student.email, escalate_to, id);
    }

    res.json(updatedComplaint);
  } catch (error) {
    console.error('Manual escalate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
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
