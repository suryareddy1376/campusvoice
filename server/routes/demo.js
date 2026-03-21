const express = require('express');
const router = express.Router();
const supabase = require('../services/supabase');

// GET /api/demo-seed
router.get('/', async (req, res) => {
  try {
    const departments = ['Hostel','Academic','Infrastructure','IT','Cafeteria','Sports','Finance','Security'];
    const results = [];

    // Helper: create or find a user via Supabase Auth + users table
    async function ensureUser({ email, name, role, department, level }) {
      // Check if already in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      let userId;

      if (existingUser) {
        userId = existingUser.id;
        results.push({ email, status: 'exists' });
      } else {
        // Create in Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email,
          password: 'password123',
          email_confirm: true,
          user_metadata: { name, department, level },
        });

        if (authError) {
          // If user exists in Auth but not in users table, fetch their ID
          if (authError.message.includes('already been registered') || authError.message.includes('already exists')) {
            const { data: { users: authUsers } } = await supabase.auth.admin.listUsers();
            const existing = authUsers?.find(u => u.email === email);
            if (existing) {
              userId = existing.id;
              // Insert into users table
              await supabase.from('users').upsert({
                id: userId,
                name,
                email,
                role,
              }, { onConflict: 'id' });
              results.push({ email, status: 'auth_exists_linked' });
            } else {
              console.error(`Cannot find auth user for ${email}:`, authError.message);
              results.push({ email, status: 'error', error: authError.message });
              return null;
            }
          } else {
            console.error(`Error creating ${email}:`, authError.message);
            results.push({ email, status: 'error', error: authError.message });
            return null;
          }
        } else {
          userId = authData.user.id;
          // Insert into users table
          const { error: dbError } = await supabase.from('users').upsert({
            id: userId,
            name,
            email,
            role,
          }, { onConflict: 'id' });

          if (dbError) {
            console.error(`DB insert error for ${email}:`, dbError.message);
          }
          results.push({ email, status: 'created' });
        }
      }

      // Ensure department_admins entry for admins
      if (userId && role === 'admin') {
        const { data: existingAdmin } = await supabase
          .from('department_admins')
          .select('id')
          .eq('user_id', userId)
          .single();

        if (!existingAdmin) {
          await supabase.from('department_admins').insert({
            user_id: userId,
            department: department || 'All',
            level: level || 1,
          });
        }
      }

      return userId;
    }

    // ── Create Student ──
    await ensureUser({
      email: 'student@demo.klu.ac.in',
      name: 'Demo Student',
      role: 'student',
      department: null,
      level: null,
    });

    // ── Create Chairman (Level 3) ──
    await ensureUser({
      email: 'chairman@demo.klu.ac.in',
      name: 'Executive Chairman',
      role: 'admin',
      department: 'All',
      level: 3,
    });

    // ── Create Super Admin ──
    await ensureUser({
      email: 'admin@demo.klu.ac.in',
      name: 'Super Administrator',
      role: 'super_admin',
      department: 'All',
      level: 4,
    });

    // ── Create Staff + HOD for each department ──
    for (const dept of departments) {
      // Level 1: Staff
      await ensureUser({
        email: `${dept.toLowerCase()}_staff@demo.klu.ac.in`,
        name: `${dept} Staff`,
        role: 'admin',
        department: dept,
        level: 1,
      });

      // Level 2: HOD
      await ensureUser({
        email: `${dept.toLowerCase()}_hod@demo.klu.ac.in`,
        name: `${dept} HOD`,
        role: 'admin',
        department: dept,
        level: 2,
      });
    }

    res.json({ message: 'Demo seed completed successfully', details: results });
  } catch (error) {
    console.error('Demo seed error:', error.message);
    res.status(500).json({ error: 'Internal server error during demo seeding' });
  }
});

module.exports = router;
