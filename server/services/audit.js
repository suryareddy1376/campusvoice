const crypto = require('crypto');
const supabase = require('./supabase');

async function logAction(complaint_id, action, performed_by) {
  try {
    const timestamp = Date.now().toString();
    const hashInput = `${complaint_id}${action}${performed_by}${timestamp}`;
    const hash = crypto.createHash('sha256').update(hashInput).digest('hex');

    const { data, error } = await supabase
      .from('audit_logs')
      .insert({
        complaint_id,
        action,
        performed_by,
        hash,
      })
      .select()
      .single();

    if (error) {
      console.error('Audit log error:', error.message);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Audit log exception:', error.message);
    return null;
  }
}

module.exports = { logAction };
