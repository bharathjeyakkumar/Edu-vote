require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
  console.log("🛠️ Starting Email Test...");
  console.log("📧 Sending from:", process.env.EMAIL_USER);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  try {
    await transporter.verify();
    console.log("✅ SUCCESS: Server is ready to take our messages");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send it to yourself
      subject: "EduVote Test",
      text: "If you see this, Nodemailer is working!"
    });
    console.log("📨 SUCCESS: Email sent! Check your inbox.");

  } catch (error) {
    console.log("❌ FAILED!");
    console.error(error);
  }
}

testEmail();