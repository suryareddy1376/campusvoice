const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function test() {
  const { data, error } = await supabase.from('users').update({ role: 'admin_hostel' }).eq('email', 'surya23570@gmail.com');
  console.log(error ? error.message : 'Success updating to admin_hostel');
  // revert
  await supabase.from('users').update({ role: 'super_admin' }).eq('email', 'surya23570@gmail.com');
}
test();
