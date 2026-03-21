const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');
const { authenticate, authorize } = require('../middleware/auth');

// Note: ALL routes in this file require 'super_admin' role.
// The authorize middleware ensures this.

// GET /api/users/admins — list all admins
router.get('/admins', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const { data: admins, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .in('role', ['admin', 'super_admin'])
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Fetch department & level from department_admins table
    const { data: deptAdmins } = await supabase
      .from('department_admins')
      .select('user_id, department, level');

    const deptMap = {};
    if (deptAdmins) {
      deptAdmins.forEach(da => {
        deptMap[da.user_id] = { department: da.department, level: da.level };
      });
    }

    const mergedAdmins = admins.map(admin => ({
      ...admin,
      department: deptMap[admin.id]?.department || 'All',
      level: deptMap[admin.id]?.level || null,
    }));

    res.json(mergedAdmins);
  } catch (error) {
    console.error('Fetch admins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/admin — create a new admin account
router.post('/admin', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const { name, email, password, department, level } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const adminLevel = parseInt(level) || 1; // Default to Level 1 (Staff)
    const adminDepartment = department || 'All';

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, department: adminDepartment, level: adminLevel }
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    // 2. Insert into users table
    const { data: user, error: dbError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email,
        role: 'admin',
      })
      .select('id, name, email, role, created_at')
      .single();

    if (dbError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: dbError.message });
    }

    // 3. Insert into department_admins for escalation routing
    const { error: deptError } = await supabase
      .from('department_admins')
      .insert({
        user_id: authData.user.id,
        department: adminDepartment,
        level: adminLevel,
      });

    if (deptError) {
      console.error('department_admins insert error (non-fatal):', deptError.message);
      // Non-fatal: the admin account exists, just the escalation mapping is missing
    }

    res.status(201).json({ ...user, department: adminDepartment, level: adminLevel });
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/users/admin/:id — delete an admin account
router.delete('/admin/:id', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting oneself
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Verify it's actually an admin being deleted (not a student)
    const { data: targetUser } = await supabase
      .from('users')
      .select('role')
      .eq('id', id)
      .single();

    if (!targetUser || targetUser.role === 'student') {
      return res.status(400).json({ error: 'Can only delete admin accounts from this endpoint' });
    }

    // 1. Delete from department_admins first (FK dependency)
    await supabase
      .from('department_admins')
      .delete()
      .eq('user_id', id);

    // 2. Delete from users table
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    // 3. Delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    
    if (authError) {
      console.error('Failed to delete auth user, but db record is removed:', authError);
      // We don't fail here because the DB record is gone, meaning they can't log in
      // and do anything anyway.
    }

    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
