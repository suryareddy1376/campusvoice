const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const supabase = require('../services/supabase');
const { authenticate } = require('../middleware/auth');
require('dotenv').config();

// Create a separate client for sign-in (anon-like behavior with service key)
// This is needed because the service role client can have issues with signInWithPassword
const authClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Public registration is student-only. Admin/super_admin accounts
    // must be created directly in Supabase or via a super_admin endpoint.
    const userRole = 'student';

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Supabase Auth create error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    // Insert into users table
    const { data: user, error: dbError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        name,
        email,
        role: userRole,
      })
      .select()
      .single();

    if (dbError) {
      console.error('DB insert error:', dbError);
      // Rollback: delete from Supabase Auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(400).json({ error: dbError.message });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, user });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Authenticate via Supabase Auth using a fresh client to avoid session conflicts
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Supabase Auth login error:', authError.message);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!authData || !authData.user) {
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Fetch user from users table
    const { data: user, error: dbError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (dbError) {
      console.error('DB fetch error:', dbError);
      return res.status(401).json({ error: 'User profile not found' });
    }

    if (!user) {
      return res.status(401).json({ error: 'User not found in database' });
    }

    // Extract department and level from department_admins table if they are an admin
    let department = 'All';
    let level = null;

    if (user.role === 'admin') {
      const { data: deptAdmin } = await supabase
        .from('department_admins')
        .select('department, level')
        .eq('user_id', user.id)
        .single();
      
      if (deptAdmin) {
        department = deptAdmin.department;
        level = deptAdmin.level;
      }
    }

    user.department = department;
    user.level = level;

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name, department, level },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Sign out from Supabase to clean up the session (we use our own JWT)
    await authClient.auth.signOut();

    res.json({ token, user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', req.user.id)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
