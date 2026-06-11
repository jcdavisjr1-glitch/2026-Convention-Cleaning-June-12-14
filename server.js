require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const { ASSIGNMENTS } = require('./data/assignments');

const app = express();
const PORT = process.env.PORT || 3000;
const STATE_FILE = path.join(__dirname, 'data', 'state.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading state:', e.message);
  }
  return {};
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function totalTasks(assignment) {
  return assignment.sections.reduce((sum, sec) => sum + sec.tasks.length, 0);
}

// GET /api/assignment/:code — fetch assignment data and current check state
app.get('/api/assignment/:code', (req, res) => {
  const code = req.params.code.toLowerCase();
  const assignment = ASSIGNMENTS[code];
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

  const state = loadState();
  const s = state[code] || { checkedTasks: {}, completed: false, completedAt: null, completedBy: null };

  // Strip phone numbers before sending to client
  const { assistantPhone, captainPhone, ...safe } = assignment;
  res.json({ assignment: safe, state: s });
});

// POST /api/assignment/:code/task — toggle a single task checkbox
app.post('/api/assignment/:code/task', (req, res) => {
  const code = req.params.code.toLowerCase();
  if (!ASSIGNMENTS[code]) return res.status(404).json({ error: 'Assignment not found' });

  const { taskId, checked } = req.body;
  const state = loadState();
  if (!state[code]) state[code] = { checkedTasks: {}, completed: false, completedAt: null, completedBy: null };

  if (checked) {
    state[code].checkedTasks[taskId] = true;
  } else {
    delete state[code].checkedTasks[taskId];
  }

  saveState(state);
  res.json({ success: true });
});

// POST /api/assignment/:code/complete — mark complete and send SMS
app.post('/api/assignment/:code/complete', async (req, res) => {
  const code = req.params.code.toLowerCase();
  const assignment = ASSIGNMENTS[code];
  if (!assignment) return res.status(404).json({ error: 'Assignment not found' });

  const { completedBy } = req.body;
  const state = loadState();
  if (!state[code]) state[code] = { checkedTasks: {}, completed: false, completedAt: null, completedBy: null };

  state[code].completed = true;
  state[code].completedAt = new Date().toISOString();
  state[code].completedBy = completedBy || assignment.captain || 'Captain';
  saveState(state);

  // Send SMS via Twilio if configured
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, OVERSEER_PHONE } = process.env;
  if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER) {
    const time = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York'
    });
    const msg =
      `✅ CLEANING COMPLETE\n` +
      `${assignment.day} @ ${time} ET\n` +
      `${assignment.congregation} Congregation\n` +
      `${assignment.area}\n` +
      `Captain: ${state[code].completedBy}`;

    const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    const recipients = [
      OVERSEER_PHONE || '7272787454',
      assignment.assistantPhone
    ].filter(Boolean);

    for (const num of recipients) {
      try {
        await twilio.messages.create({
          body: msg,
          from: TWILIO_FROM_NUMBER,
          to: `+1${num.replace(/\D/g, '')}`
        });
      } catch (err) {
        console.error(`SMS to ${num} failed:`, err.message);
      }
    }
  } else {
    console.log('SMS not configured — skipping. Set TWILIO_* env vars to enable.');
  }

  // Send email notifications if configured
  const { EMAIL_FROM, EMAIL_PASSWORD, OVERSEER_EMAIL } = process.env;
  if (EMAIL_FROM && EMAIL_PASSWORD && OVERSEER_EMAIL) {
    const time = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'America/New_York'
    });
    const subject = `✅ Cleaning Complete — ${assignment.congregation} (${assignment.day})`;
    const body = `
      <h2 style="color:#15803d">✅ Assignment Complete</h2>
      <table style="font-family:sans-serif;font-size:15px;line-height:1.8">
        <tr><td><strong>Day:</strong></td><td>${assignment.day} @ ${time} ET</td></tr>
        <tr><td><strong>Congregation:</strong></td><td>${assignment.congregation}</td></tr>
        <tr><td><strong>Area:</strong></td><td>${assignment.area}</td></tr>
        <tr><td><strong>Captain:</strong></td><td>${state[code].completedBy}</td></tr>
        <tr><td><strong>Zone Overseer:</strong></td><td>${assignment.assistantOverseer}</td></tr>
      </table>
    `;

    try {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: EMAIL_FROM, pass: EMAIL_PASSWORD }
      });

      const emailRecipients = [OVERSEER_EMAIL];
      if (process.env[`ASSISTANT_EMAIL_${assignment.assistantOverseer.split(' ')[1].toUpperCase()}`]) {
        emailRecipients.push(process.env[`ASSISTANT_EMAIL_${assignment.assistantOverseer.split(' ')[1].toUpperCase()}`]);
      }

      await transporter.sendMail({
        from: `"2026 Convention Cleaning" <${EMAIL_FROM}>`,
        to: emailRecipients.join(', '),
        subject,
        html: body
      });
      console.log(`Email sent to: ${emailRecipients.join(', ')}`);
    } catch (err) {
      console.error('Email failed:', err.message);
    }
  }

  res.json({ success: true });
});

// GET /api/status — all assignments for the dashboard
app.get('/api/status', (req, res) => {
  const state = loadState();
  const result = {};

  for (const [code, assignment] of Object.entries(ASSIGNMENTS)) {
    const s = state[code] || { checkedTasks: {}, completed: false };
    const total = totalTasks(assignment);
    const checked = Object.keys(s.checkedTasks).length;
    result[code] = {
      code,
      day: assignment.day,
      dayShort: assignment.dayShort,
      congregation: assignment.congregation,
      location: assignment.location,
      area: assignment.area,
      captain: assignment.captain,
      assistantOverseer: assignment.assistantOverseer,
      isSunday: assignment.isSunday || false,
      completed: !!s.completed,
      completedAt: s.completedAt || null,
      completedBy: s.completedBy || null,
      checkedCount: checked,
      totalTasks: total,
      inProgress: checked > 0 && !s.completed
    };
  }

  res.json(result);
});

// POST /api/reset/:code — admin: clear state for one assignment
app.post('/api/reset/:code', (req, res) => {
  const code = req.params.code.toLowerCase();
  if (!ASSIGNMENTS[code]) return res.status(404).json({ error: 'Assignment not found' });
  const state = loadState();
  delete state[code];
  saveState(state);
  res.json({ success: true });
});

// GET /api/email-test — send a test email to verify Gmail is working
app.get('/api/email-test', async (req, res) => {
  const { EMAIL_FROM, EMAIL_PASSWORD, OVERSEER_EMAIL } = process.env;
  if (!EMAIL_FROM || !EMAIL_PASSWORD || !OVERSEER_EMAIL) {
    return res.json({ success: false, error: 'Email env vars not set', vars: {
      EMAIL_FROM: !!EMAIL_FROM, EMAIL_PASSWORD: !!EMAIL_PASSWORD, OVERSEER_EMAIL: !!OVERSEER_EMAIL
    }});
  }
  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: EMAIL_FROM, pass: EMAIL_PASSWORD }
    });
    await transporter.sendMail({
      from: `"2026 Convention Cleaning" <${EMAIL_FROM}>`,
      to: OVERSEER_EMAIL,
      subject: '✅ Test — Convention Cleaning Tracker Email Working',
      html: '<h2 style="color:#15803d">Email notifications are working!</h2><p>Your convention cleaning tracker is set up correctly.</p>'
    });
    res.json({ success: true, sentTo: OVERSEER_EMAIL });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// GET /api/sms-test — send a test text to the overseer number to verify Twilio is working
app.get('/api/sms-test', async (req, res) => {
  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, OVERSEER_PHONE } = process.env;

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_NUMBER) {
    return res.json({ success: false, error: 'Twilio env vars not set', vars: {
      TWILIO_ACCOUNT_SID: !!TWILIO_ACCOUNT_SID,
      TWILIO_AUTH_TOKEN: !!TWILIO_AUTH_TOKEN,
      TWILIO_FROM_NUMBER: !!TWILIO_FROM_NUMBER,
      OVERSEER_PHONE: !!OVERSEER_PHONE
    }});
  }

  try {
    const twilio = require('twilio')(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
    const to = `+1${(OVERSEER_PHONE || '7272787454').replace(/\D/g, '')}`;
    const message = await twilio.messages.create({
      body: '✅ Test message from Convention Cleaning Tracker — Twilio is working!',
      from: TWILIO_FROM_NUMBER,
      to
    });
    res.json({ success: true, messageSid: message.sid, to });
  } catch (err) {
    res.json({ success: false, error: err.message, code: err.code });
  }
});

app.listen(PORT, () => {
  console.log(`Convention Cleaning Tracker running on port ${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}/`);
  console.log(`Example checklist: http://localhost:${PORT}/checklist.html?code=fri-a`);
});
