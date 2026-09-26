import nodemailer from 'nodemailer';

const reply = (res, status, payload) => res.status(status).json(payload);

async function getBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);

  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 12_000) throw new Error('Request is too large.');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return reply(res, 405, { success: false, message: 'Use POST to send a message.' });

  let data;
  try {
    data = await getBody(req);
  } catch {
    return reply(res, 400, { success: false, message: 'The form data could not be read.' });
  }

  // Silently accept bot submissions without sending email.
  if (data.website) return reply(res, 200, { success: true });

  const name = String(data.name || '').trim().slice(0, 120);
  const email = String(data.email || '').trim().slice(0, 254);
  const subject = String(data.subject || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 180);
  const message = String(data.message || '').trim().slice(0, 8000);

  if (!name || !subject || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply(res, 400, { success: false, message: 'Enter a valid name, email, subject, and message.' });
  }

  const gmailUser = process.env.GMAIL_USER;
  const appPassword = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !appPassword) {
    return reply(res, 503, { success: false, message: 'Email delivery is not configured on the server yet.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user: gmailUser, pass: appPassword.replace(/\s/g, '') },
      connectionTimeout: 12000,
      greetingTimeout: 12000,
      socketTimeout: 20000,
    });

    await transporter.sendMail({
      from: `Vishal Kumar Portfolio <${gmailUser}>`,
      to: process.env.CONTACT_TO || gmailUser,
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`,
    });

    return reply(res, 200, { success: true, message: 'Your message has been sent.' });
  } catch (error) {
    console.error('Contact email delivery failed:', error?.code || error?.message || 'unknown error');
    return reply(res, 502, { success: false, message: 'Gmail could not deliver this message. Check the server email settings and try again.' });
  }
}
