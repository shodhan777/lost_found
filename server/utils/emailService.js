const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.log('⚠️  EMAIL_USER or EMAIL_PASS not set. Logging email to console instead.');
            console.log(`[Email Mock] To: ${to}, Subject: ${subject}, Text: ${text}`);
            return true;
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail', // or 'smtp.ethereal.email' for testing
            auth: {
                user: process.env.EMAIL_USER, // Your email
                pass: process.env.EMAIL_PASS, // Your App Password
            },
        });

        const mailOptions = {
            from: '"Lost & Found Support" <no-reply@lostandfound.com>',
            to: to,
            subject: subject,
            text: text,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #667eea;">Lost & Found Update</h2>
          <p>${text}</p>
          <hr>
          <p style="font-size: 12px; color: #777;">This is an automated message.</p>
        </div>
      `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email sent: ' + info.response);
        return true;
    } catch (error) {
        console.error('❌ Error sending email:', error);
        // Don't crash the server if email fails, just log it
        return false;
    }
};

module.exports = sendEmail;
