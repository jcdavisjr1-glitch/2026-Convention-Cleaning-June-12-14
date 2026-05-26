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
      `Assignment ${assignment.assignment}: ${assignment.congregation}\n` +
      `Area: ${assignment.area}\n` +
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
      assignment: assignment.assignment,
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

app.listen(PORT, () => {
  console.log(`Convention Cleaning Tracker running on port ${PORT}`);
  console.log(`Dashboard: http://localhost:${PORT}/`);
  console.log(`Example checklist: http://localhost:${PORT}/checklist.html?code=fri-a`);
});
