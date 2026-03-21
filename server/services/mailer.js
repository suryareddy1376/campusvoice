const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendSubmissionConfirmation(studentEmail, complaintId) {
  try {
    await transporter.sendMail({
      from: `"CampusVoice" <${process.env.GMAIL_USER}>`,
      to: studentEmail,
      subject: `Complaint Submitted — ${complaintId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">CampusVoice</h2>
          <p>Your complaint has been successfully submitted.</p>
          <p><strong>Complaint ID:</strong> ${complaintId}</p>
          <p>Our team will review it and get back to you within 24 hours.</p>
          <hr style="border: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px;">This is an automated message from CampusVoice.</p>
        </div>
      `,
    });
    console.log(`Submission confirmation sent to ${studentEmail}`);
  } catch (error) {
    console.error('Email send error (submission):', error.message);
  }
}

async function sendReplyNotification(studentEmail, replyText, complaintId) {
  try {
    await transporter.sendMail({
      from: `"CampusVoice" <${process.env.GMAIL_USER}>`,
      to: studentEmail,
      subject: `Reply to Your Complaint — ${complaintId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">CampusVoice</h2>
          <p>An admin has responded to your complaint.</p>
          <p><strong>Complaint ID:</strong> ${complaintId}</p>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0;">${replyText}</p>
          </div>
          <hr style="border: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px;">This is an automated message from CampusVoice.</p>
        </div>
      `,
    });
    console.log(`Reply notification sent to ${studentEmail}`);
  } catch (error) {
    console.error('Email send error (reply):', error.message);
  }
}

async function sendEscalationAlert(superAdminEmail, complaintDetails) {
  try {
    await transporter.sendMail({
      from: `"CampusVoice" <${process.env.GMAIL_USER}>`,
      to: superAdminEmail,
      subject: `⚠️ Escalation Alert — Complaint ${complaintDetails.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">⚠️ Escalation Alert</h2>
          <p>The following complaint has not been resolved within 24 hours:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px; font-weight: bold;">Complaint ID</td><td style="padding: 8px;">${complaintDetails.id}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Category</td><td style="padding: 8px;">${complaintDetails.category}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Priority</td><td style="padding: 8px;">${complaintDetails.priority}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Text</td><td style="padding: 8px;">${complaintDetails.text}</td></tr>
            <tr><td style="padding: 8px; font-weight: bold;">Submitted</td><td style="padding: 8px;">${new Date(complaintDetails.created_at).toLocaleString()}</td></tr>
          </table>
          <p>Please take immediate action.</p>
          <hr style="border: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 12px;">CampusVoice Escalation System</p>
        </div>
      `,
    });
    console.log(`Escalation alert sent to ${superAdminEmail}`);
  } catch (error) {
    console.error('Email send error (escalation):', error.message);
  }
}

async function escalationToHOD(hodEmail, complaintDetails) {
  const mailOptions = {
    from: `"CampusVoice Escalations" <${process.env.GMAIL_USER}>`,
    to: hodEmail,
    subject: 'Complaint Escalated To Your Department — Action Required',
    html: `
      <h2>Action Required: Escalated Complaint</h2>
      <p>A complaint in your department has not been resolved within 48 hours and has been escalated to you.</p>
      <ul>
        <li><b>Complaint ID:</b> ${complaintDetails.id}</li>
        <li><b>Department:</b> ${complaintDetails.department}</li>
        <li><b>Category:</b> ${complaintDetails.category}</li>
        <li><b>Priority:</b> ${complaintDetails.priority}</li>
        <li><b>Submitted:</b> ${new Date(complaintDetails.created_at).toLocaleString()}</li>
      </ul>
      <p><b>Complaint:</b> "${complaintDetails.text}"</p>
      <p>Please log in and resolve this within 7 days to avoid auto-escalation to the Chairman.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Escalation to HOD sent: ${hodEmail}`);
  } catch (error) {
    console.error(`[Email Error] sendEscalationToHOD: ${error.message}`);
  }
}

async function escalationToChairman(chairmanEmail, complaintDetails) {
  const mailOptions = {
    from: `"CampusVoice Executive Alerts" <${process.env.GMAIL_USER}>`,
    to: chairmanEmail,
    subject: 'URGENT — Complaint Unresolved After HOD Level',
    html: `
      <h2>Immediate Action Required: Executive Escalation</h2>
      <p>A complaint has not been resolved at the HOD level and has been escalated to the Chairman.</p>
      <ul>
        <li><b>Complaint ID:</b> ${complaintDetails.id}</li>
        <li><b>Department:</b> ${complaintDetails.department}</li>
        <li><b>Priority:</b> ${complaintDetails.priority}</li>
        <li><b>Submitted:</b> ${new Date(complaintDetails.created_at).toLocaleString()}</li>
        <li><b>Escalated to HOD at:</b> ${new Date(complaintDetails.escalated_at || complaintDetails.created_at).toLocaleString()}</li>
        <li><b>Days Elapsed:</b> ${complaintDetails.days || 7}</li>
      </ul>
      <p><b>Complaint:</b> "${complaintDetails.text}"</p>
      <p>This issue requires your immediate personal attention as department SLAs have been breached.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Escalation to Chairman sent: ${chairmanEmail}`);
  } catch (error) {
    console.error(`[Email Error] sendEscalationToChairman: ${error.message}`);
  }
}

async function emergencyToChairman(chairmanEmail, complaintDetails) {
  const mailOptions = {
    from: `"CampusVoice EMERGENCY" <${process.env.GMAIL_USER}>`,
    to: chairmanEmail,
    subject: 'EMERGENCY COMPLAINT — IMMEDIATE ACTION REQUIRED',
    html: `
      <h2 style="color: red;">🚨 EMERGENCY: IMMEDIATE ACTION REQUIRED 🚨</h2>
      <p>An emergency complaint has been submitted and remains unresolved or requires immediate fast-track attention.</p>
      <ul>
        <li><b>Complaint ID:</b> ${complaintDetails.id}</li>
        <li><b>Submitted:</b> ${new Date(complaintDetails.created_at).toLocaleString()}</li>
      </ul>
      <p><b>Complaint Details:</b> "${complaintDetails.text}"</p>
      <p><strong>This requires your immediate personal attention per emergency protocols.</strong></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Emergency to Chairman sent: ${chairmanEmail}`);
  } catch (error) {
    console.error(`[Email Error] sendEmergencyToChairman: ${error.message}`);
  }
}

async function studentEscalationNotice(studentEmail, level, complaintId) {
  const mailOptions = {
    from: `"CampusVoice Support" <${process.env.GMAIL_USER}>`,
    to: studentEmail,
    subject: 'Your complaint has been escalated',
    html: `
      <h2>Complaint Escalation Notice</h2>
      <p>Your complaint <b>${complaintId}</b> has been escalated to the <b>${level}</b> level because it was not resolved within the required timeframe.</p>
      <p>We are committed to resolving this as soon as possible and have notified the appropriate higher authorities.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Student Escalation Notice sent: ${studentEmail}`);
  } catch (error) {
    console.error(`[Email Error] sendStudentEscalationNotice: ${error.message}`);
  }
}

module.exports = {
  sendSubmissionConfirmation,
  sendReplyNotification,
  sendEscalationAlert,
  escalationToHOD,
  escalationToChairman,
  emergencyToChairman,
  studentEscalationNotice
};
