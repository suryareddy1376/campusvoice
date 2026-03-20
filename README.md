# CampusVoice 🎓

> An AI-powered campus grievance management platform built for a hackathon. Students submit complaints, AI classifies and routes them to the right department, and admins resolve them with full transparency.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind-less Vanilla CSS |
| Backend | Node.js + Express |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini 2.0 Flash (vision + text) |
| NLP | Natural.js (local classification) |
| Auth | JWT (bcrypt hashed passwords) |
| Email | Nodemailer (Gmail SMTP) |
| Cron | node-cron (SLA escalation) |

---

## ✨ Key Features

- **AI Complaint Classification** — 8 departments auto-routed
- **Multilingual Voice Input** — Speak in Hindi/Telugu, AI translates to English
- **Image Vision Verification** — Gemini checks if photo evidence matches the complaint
- **Predictive Analytics** — AI forecasts future campus issues before they occur
- **Anonymous Complaints** — Student identity hidden from all non-super-admins
- **SLA Escalation** — Unresolved complaints auto-escalated after 24h via email
- **AI Smart Reply** — Admins get Gemini-drafted responses in one click
- **Transparency Wall** — Public board of resolved complaints for accountability
- **Mobile Responsive** — Hamburger nav + bottom tab bar for mobile UX

---

## 📁 Project Structure

```
Campus Complaint/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── utils/
│   └── vercel.json  # Vercel deploy config
├── server/          # Express API backend
│   ├── routes/
│   ├── services/
│   ├── middleware/
│   ├── .env.example # Copy to .env and fill in keys
│   └── server.js
└── render.yaml      # Render deploy config
```

---

## 🛠️ Local Development Setup

### 1. Clone & Install Dependencies

```bash
# Install server deps
cd server && npm install

# Install client deps
cd ../client && npm install
```

### 2. Configure Environment Variables

```bash
# Copy example and fill in your real keys
cp server/.env.example server/.env
```

| Variable | Where to get it |
|---|---|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_KEY` | Supabase Dashboard → Settings → API → service_role |
| `GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `JWT_SECRET` | Any long random string (e.g. `openssl rand -hex 32`) |
| `GMAIL_USER` | Your Gmail address |
| `GMAIL_APP_PASSWORD` | Google Account → Security → App Passwords |

### 3. Run Locally

```bash
# Terminal 1 — Backend (port 5000)
cd server && node server.js

# Terminal 2 — Frontend (port 3000)
cd client && npm run dev
```

Open → http://localhost:3000

---

## ☁️ Deployment

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
2. Set **Root Directory** to `client`
3. Framework preset: **Vite**
4. Add environment variable: none needed (all secrets are backend-only)
5. Deploy!
6. Copy the Vercel URL (e.g. `https://campusvoice.vercel.app`)

> **Important:** After getting your Vercel URL, open `client/vercel.json` and update the `destination` URL to your Render backend URL.

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service** → Connect GitHub repo
2. Set **Root Directory** to `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Set all environment variables from `server/.env.example`
6. Add `FRONTEND_URL=https://your-app.vercel.app` (your Vercel URL)
7. Deploy!

---

## 👥 Roles

| Role | Access |
|---|---|
| `student` | Submit & view own complaints |
| `admin` | Manage complaints in their department |
| `super_admin` | Full access: all complaints, analytics, manage admins |

---

## 🔒 Security

- All API keys live server-side only
- JWT authentication on all protected routes
- Bcrypt password hashing
- CORS restricted to allowed origins
- AI spam/fraud detection on every submission
