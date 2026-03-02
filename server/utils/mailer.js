const nodemailer = require('nodemailer');

const dotenv = require("dotenv")

dotenv.config()


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

exports.sendReportEmail = async (userEmail, problemReport) => {
  try {
    await transporter.sendMail({
      from: 'noreply@holygames.com',
      to: 'berdiabekauri5@gmail.com',
      subject: 'New Problem Report from HolyGames',
      html: `
        <h2>Problem Report Received</h2>
        <p><strong>From:</strong> ${userEmail}</p>
        <p><strong>Message:</strong></p>
        <p>${problemReport}</p>
      `
    });
    return { success: true, message: 'Email sent successfully' };
  } catch (err) {
    console.error('Email error:', err);
    throw err;
  }
};
