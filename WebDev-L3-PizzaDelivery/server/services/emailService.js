import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = async () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Generate test Ethereal account if running in sandbox/development
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log(`[Email Service] Ethereal sandbox initialized: ${testAccount.user}`);
    } catch (e) {
      console.warn('[Email Service] Operating in console-logger simulation mode.');
      transporter = {
        sendMail: async (mailOptions) => {
          console.log(`\n================== [OUTGOING EMAIL SIMULATION] ==================`);
          console.log(`To: ${mailOptions.to}`);
          console.log(`Subject: ${mailOptions.subject}`);
          console.log(`Text Preview: ${mailOptions.text || 'HTML Content'}`);
          console.log(`=================================================================\n`);
          return { messageId: `simulated_${Date.now()}` };
        }
      };
    }
  }

  return transporter;
};

export const sendVerificationEmail = async (email, token) => {
  const mailer = await getTransporter();
  const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

  const info = await mailer.sendMail({
    from: process.env.EMAIL_FROM || '"Crust & Craft" <no-reply@crustcraft.com>',
    to: email,
    subject: 'Confirm Your Crust & Craft Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0b0e14; color: #ffffff; border-radius: 12px; border: 1px solid #222;">
        <h1 style="color: #f59e0b; margin-top: 0;">Welcome to Crust & Craft</h1>
        <p style="color: #cbd5e1; font-size: 16px;">Thank you for registering. Please click the button below to verify your email address:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyUrl}" style="background: #ea580c; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="color: #64748b; font-size: 12px;">If you did not register for Crust & Craft, please ignore this message.</p>
      </div>
    `
  });

  return info;
};

export const sendPasswordResetEmail = async (email, token) => {
  const mailer = await getTransporter();
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;

  const info = await mailer.sendMail({
    from: process.env.EMAIL_FROM || '"Crust & Craft Security" <security@crustcraft.com>',
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #0b0e14; color: #ffffff; border-radius: 12px; border: 1px solid #222;">
        <h2 style="color: #f59e0b;">Password Recovery</h2>
        <p style="color: #cbd5e1;">A password reset was requested for your account. This link is valid for 15 minutes:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetUrl}" style="background: #f59e0b; color: #000; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
      </div>
    `
  });

  return info;
};

export const sendLowStockAlertEmail = async (items) => {
  const mailer = await getTransporter();
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@crustcraft.com';

  const rows = items
    .map(
      (item) => `
    <tr style="border-bottom: 1px solid #334155;">
      <td style="padding: 10px; color: #f8fafc; font-weight: bold;">${item.name}</td>
      <td style="padding: 10px; color: #94a3b8; text-transform: uppercase; font-size: 12px;">${item.category}</td>
      <td style="padding: 10px; color: #ef4444; font-weight: bold; text-align: center;">${item.stockQuantity}</td>
      <td style="padding: 10px; color: #64748b; text-align: center;">${item.alertThreshold}</td>
    </tr>
  `
    )
    .join('');

  const info = await mailer.sendMail({
    from: process.env.EMAIL_FROM || '"Kitchen Automation" <alerts@crustcraft.com>',
    to: adminEmail,
    subject: `🚨 CRITICAL: Low Stock Warning (${items.length} ingredients below threshold)`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 25px; background: #0f172a; color: #ffffff; border-radius: 12px; border: 1px solid #ef4444;">
        <h2 style="color: #ef4444; margin-top: 0;">⚠️ Automated Inventory Alert</h2>
        <p style="color: #cbd5e1;">The background monitor detected ingredients at or below configured alert thresholds:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #1e293b; border-radius: 8px;">
          <thead>
            <tr style="background: #334155; text-align: left; color: #f1f5f9;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px;">Category</th>
              <th style="padding: 10px; text-align: center;">Current Stock</th>
              <th style="padding: 10px; text-align: center;">Threshold</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <p style="color: #94a3b8; font-size: 14px;">Please replenish ingredients in the Admin Portal to avoid cart checkout blocks.</p>
      </div>
    `
  });

  return info;
};
