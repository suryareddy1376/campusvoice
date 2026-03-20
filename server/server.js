const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ── Startup environment validation ────────────────────
const REQUIRED_ENV = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'JWT_SECRET', 'GEMINI_API_KEY'];
const missing = REQUIRED_ENV.filter(k => !process.env[k]);
if (missing.length) {
  console.warn(`⚠️  Missing env vars: ${missing.join(', ')} — some features may not work`);
}

// ── Ensure uploads directory exists ───────────────────
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads/ directory');
}

const app = express();

// ── CORS — allow dev + production Vercel URL ──────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  process.env.FRONTEND_URL,          // e.g. https://campusvoice.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadsDir));

// ── API Routes ─────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/complaints',   require('./routes/complaints'));
app.use('/api/ai',           require('./routes/ai'));
app.use('/api/analytics',    require('./routes/analytics'));
app.use('/api/transparency', require('./routes/transparency'));
app.use('/api/users',        require('./routes/users'));

// ── Health check ───────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// ── Global error handler ───────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── Escalation cron ────────────────────────────────────
const { startEscalationCron } = require('./services/escalation');
startEscalationCron();

// ── Start server ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 CampusVoice API running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});
