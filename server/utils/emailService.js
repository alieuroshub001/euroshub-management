const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send notification email
const sendNotificationEmail = async (to, subject, htmlContent) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: htmlContent
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send task assignment email
const sendTaskAssignmentEmail = async (userEmail, taskDetails) => {
  const htmlContent = `
    <h2>New Task Assigned</h2>
    <p>You have been assigned a new task:</p>
    <h3>${taskDetails.title}</h3>
    <p><strong>Description:</strong> ${taskDetails.description}</p>
    <p><strong>Due Date:</strong> ${taskDetails.dueDate}</p>
    <p><strong>Priority:</strong> ${taskDetails.priority}</p>
    <p>Please log in to your dashboard to view more details.</p>
  `;
  
  return await sendNotificationEmail(userEmail, 'New Task Assignment', htmlContent);
};

// Send project invitation email
const sendProjectInvitationEmail = async (userEmail, projectDetails, inviterName) => {
  const htmlContent = `
    <h2>Project Invitation</h2>
    <p>${inviterName} has invited you to join a project:</p>
    <h3>${projectDetails.name}</h3>
    <p><strong>Description:</strong> ${projectDetails.description}</p>
    <p>Please log in to your dashboard to accept or decline this invitation.</p>
  `;
  
  return await sendNotificationEmail(userEmail, 'Project Invitation', htmlContent);
};

module.exports = {
  sendNotificationEmail,
  sendTaskAssignmentEmail,
  sendProjectInvitationEmail
};