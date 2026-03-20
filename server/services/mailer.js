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

module.exports = { sendSubmissionConfirmation, sendReplyNotification, sendEscalationAlert };
