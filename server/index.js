import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Send email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { smtp, to, subject, html } = req.body;

    if (!smtp?.host || !smtp?.username || !smtp?.password || !smtp?.fromEmail || !to) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port || 465,
      secure: smtp.port === 465 || smtp.port === 587,
      auth: {
        user: smtp.username,
        pass: smtp.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"${smtp.fromName || 'GPT Image2'}" <${smtp.fromEmail}>`,
      to,
      subject,
      html,
    });

    console.log(`[Email] Sent to ${to}: ${subject}`);
    res.json({ success: true });
  } catch (error) {
    console.error('[Email] Send failed:', error.message);
    res.status(500).json({ error: '邮件发送失败: ' + error.message });
  }
});

// Test SMTP connection endpoint
app.post('/api/test-smtp', async (req, res) => {
  try {
    const { host, port, username, password, fromEmail, fromName } = req.body;

    if (!host || !username || !password || !fromEmail) {
      return res.status(400).json({ error: '请填写完整的 SMTP 配置信息' });
    }

    const transporter = nodemailer.createTransport({
      host,
      port: port || 465,
      secure: port === 465 || port === 587,
      auth: { user: username, pass: password },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();

    // Send a test email
    await transporter.sendMail({
      from: `"${fromName || 'GPT Image2'}" <${fromEmail}>`,
      to: fromEmail,
      subject: '【GPT Image2】SMTP 连接测试成功',
      html: `
        <div style="max-width:600px;margin:0 auto;padding:40px 20px;font-family:Arial,sans-serif;background:#0f172a;color:#e2e8f0;">
          <div style="text-align:center;margin-bottom:30px;">
            <h1 style="color:#06b6d4;font-size:28px;margin:0;">GPT Image2</h1>
          </div>
          <div style="background:#1e293b;border-radius:12px;padding:30px;border:1px solid #334155;text-align:center;">
            <h2 style="color:#22c55e;font-size:20px;margin:0 0 16px;">✅ SMTP 连接测试成功</h2>
            <p style="color:#94a3b8;line-height:1.6;margin:0;">你的 SMTP 配置正确，邮件发送功能已就绪。</p>
          </div>
        </div>
      `,
    });

    console.log('[SMTP] Test connection successful');
    res.json({ success: true });
  } catch (error) {
    console.error('[SMTP] Test failed:', error.message);
    res.status(500).json({ error: 'SMTP 连接测试失败: ' + error.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Server] Email proxy running on http://localhost:${PORT}`);
});
