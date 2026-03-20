const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function createSuperAdmin() {
  const email = 'surya23570@gmail.com';
  const name = 'Surya (Super Admin)';
  const password = 'SuperSecretPassword123!'; // Temporary password, change later
  const role = 'super_admin';

  console.log(`Setting up super admin account for ${email}...`);

  try {
    // 1. Check if user already exists in Auth
    let userId;
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) throw listError;
    
    const existingAuthUser = users.find(u => u.email === email);
    
    if (existingAuthUser) {
      console.log('User already exists in Supabase Auth, updating...');
      userId = existingAuthUser.id;
      
      // Update password
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        userId,
        { password, email_confirm: true }
      );
      if (updateError) throw updateError;
    } else {
      console.log('Creating new user in Supabase Auth...');
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (authError) throw authError;
      userId = authData.user.id;
    }

    // 2. Upsert into users table
    console.log('Ensuring user exists in users table with super_admin role...');
    const { error: dbError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        name,
        email,
        role: role,
      }, { onConflict: 'email' });

    if (dbError) throw dbError;

    console.log('\n✅ Super admin account successfully created/updated!');
    console.log('----------------------------------------------------');
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}`);
    console.log('Role:     super_admin');
    console.log('----------------------------------------------------');
    console.log('You can now log in at http://localhost:3000/login');

  } catch (error) {
    console.error('\n❌ Error creating super admin:', error.message || error);
  }
}

createSuperAdmin();
