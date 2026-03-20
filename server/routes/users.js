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

    // Fetch Auth users to get user_metadata.department
    const { data: { users: authUsers }, error: authListError } = await supabase.auth.admin.listUsers();
    
    let mergedAdmins = admins;
    if (!authListError && authUsers) {
      mergedAdmins = admins.map(admin => {
        const authUser = authUsers.find(u => u.id === admin.id);
        const department = authUser?.user_metadata?.department || 'All';
        return { ...admin, department };
      });
    }

    res.json(mergedAdmins);
  } catch (error) {
    console.error('Fetch admins error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/admin — create a new admin account
router.post('/admin', authenticate, authorize('super_admin'), async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // 1. Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, department: department || 'All' }
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
      // Rollback auth creation
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: dbError.message });
    }

    res.status(201).json({ ...user, department: department || 'All' });
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

    // 1. Delete from users table
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (dbError) {
      return res.status(400).json({ error: dbError.message });
    }

    // 2. Delete from Supabase Auth
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
