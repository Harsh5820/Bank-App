const nodemailer = require("nodemailer");

let transporter;

async function createTransporter() {
  try {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.verify();
    console.log("✅ Gmail transporter ready");
  } catch (err) {
    console.warn("⚠️ Gmail failed, falling back to Ethereal:", err.message);

    let testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log("✅ Ethereal transporter ready");
  }
}

async function sendEmail(to, subject, text) {
  if (!transporter) {
    await createTransporter();
  }

  try {
    let info = await transporter.sendMail({
      from: `"BlueBank" <${process.env.EMAIL_USER || "no-reply@bluebank.com"}>`,
      to,
      subject,
      text,
    });

    console.log("📧 Email sent:", info.messageId);

    if (nodemailer.getTestMessageUrl(info)) {
      console.log("🔗 Preview URL:", nodemailer.getTestMessageUrl(info));
    }

    return true;
  } catch (err) {
    console.error("❌ Error sending email:", err);
    return false;
  }
}

module.exports = sendEmail;
