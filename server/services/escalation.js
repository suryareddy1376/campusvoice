const cron = require('node-cron');
const supabase = require('./supabase');
const { logAction } = require('./audit');
const { sendEscalationAlert } = require('./mailer');

function startEscalationCron() {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[Escalation Cron] Running escalation check...');

    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const twentyFiveHoursAgo = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();

      // Find unresolved complaints crossing the 24-hour mark (1 hour window to prevent infinite spam)
      const { data: complaints, error: complaintsError } = await supabase
        .from('complaints')
        .select('*')
        .neq('status', 'Resolved')
        .lt('created_at', twentyFourHoursAgo)
        .gte('created_at', twentyFiveHoursAgo);

      if (complaintsError) {
        console.error('[Escalation Cron] Query error:', complaintsError.message);
        return;
      }

      if (!complaints || complaints.length === 0) {
        console.log('[Escalation Cron] No complaints to escalate.');
        return;
      }

      // Find a super_admin
      const { data: superAdmins, error: adminError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'super_admin')
        .limit(1);

      if (adminError || !superAdmins || superAdmins.length === 0) {
        console.error('[Escalation Cron] No super_admin found.');
        return;
      }

      const superAdmin = superAdmins[0];

      for (const complaint of complaints) {
        // Update status to Assigned
        await supabase
          .from('complaints')
          .update({ status: 'Assigned' })
          .eq('id', complaint.id);

        // Log the escalation
        await logAction(complaint.id, 'Escalated to super_admin', superAdmin.id);

        // Send alert email
        await sendEscalationAlert(superAdmin.email, complaint);

        console.log(`[Escalation Cron] Escalated complaint ${complaint.id}`);
      }
    } catch (error) {
      console.error('[Escalation Cron] Error:', error.message);
    }
  });

  console.log('[Escalation Cron] Scheduled — runs every hour.');
}

module.exports = { startEscalationCron };
