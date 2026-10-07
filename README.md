# MediOmni AI — Unified Multimodal Intelligence Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20%2F%202.0%20Flash-cyan.svg)](https://aistudio.google.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-emerald.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3.4-38B2AC.svg)](https://tailwindcss.com/)

MediOmni AI is a production-ready, full-stack multimodal intelligence web application. It ingests multi-format artifacts (**handwritten notes, physician consultation audio recordings, radiology imaging scans, and laboratory/pathology PDF reports**), extracts cross-modal features, and utilizes the **Google Gemini API** on the backend to synthesize unified diagnostic intelligence, cross-reference anomalies, and provide an interactive multi-turn copilot.

---

## 🏗️ Architecture & High-Level Design

```
                     +---------------------------------------+
                     |         Browser / Client UI           |
                     |   (React 18 + Vite + Tailwind CSS)    |
                     +-------------------+-------------------+
                                         |
                       HTTPS Multipart   |  JWT Bearer Auth
                       & JSON Requests   |  Axios Client
                                         v
                     +---------------------------------------+
                     |         Node.js / Express API         |
                     |  (/backend/server.js on Port 5000)    |
                     +-----+-------------------+-------------+
                           |                   |
            Multer Storage |                   | Mongoose ODM
                           v                   v
                +-------------------+ +-------------------+
                |  Local /uploads   | |  MongoDB Database |
                |  (Secure Storage) | |  (Users, Sessions)|
                +-------------------+ +-------------------+
                           |
                           v  Base64 Ingestion (Streamed)
                     +---------------------------------------+
                     |      Google Gemini 1.5/2.0 API        |
                     | (Vision, Audio, & PDF Understanding)  |
                     +---------------------------------------+
```

### 🔒 Security Principles
- **Strict Key Isolation**: The `GEMINI_API_KEY` is hosted **strictly on the backend** in `backend/.env` and is **never** bundled or exposed to the client application.
- **JWT Authentication**: Passwords hashed with `bcryptjs` (salt factor 12). Endpoints protected by bearer token middleware.
- **Upload Validation**: File sizes strictly capped at 25MB and restricted to whitelisted MIME types (`image/*`, `audio/*`, `application/pdf`, `text/*`, `video/*`).

---

## 📁 Repository Structure

```
Multimodal AI/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & reconnection handler
│   ├── controllers/
│   │   ├── authController.js     # User registration, login, and profile
│   │   ├── aiController.js       # File upload, Gemini analysis, chat, & session CRUD
│   │   └── workspaceController.js# Projects and workspace grouping
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   ├── uploadMiddleware.js   # Multer multi-format file validation
│   │   └── validatorMiddleware.js# Express-validator input sanitization
│   ├── models/
│   │   ├── User.js               # User credentials and preferences schema
│   │   ├── Workspace.js          # Collaborative workspace schema
│   │   └── MultimodalSession.js  # File metadata, AI synthesis, and chat history
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth endpoints
│   │   ├── aiRoutes.js           # /api/ai multimodal endpoints
│   │   └── workspaceRoutes.js    # /api/workspaces endpoints
│   ├── services/
│   │   └── geminiService.js      # Google Gemini 1.5 Flash/Pro SDK integration
│   ├── uploads/                  # Ingested artifact storage directory
│   ├── .env.example              # Backend environment template
│   ├── package.json              # Backend dependencies
│   └── server.js                 # Express server entry point
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosClient.js    # Configured Axios instance with interceptors
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Top navigation & session trigger
│   │   │   ├── ProtectedRoute.jsx# Auth route gatekeeper
│   │   │   ├── FileUploader.jsx  # Drag-and-drop multimodal ingestion
│   │   │   ├── InsightsDisplay.jsx# Multi-tab synthesized intelligence view
│   │   │   ├── ChatInterface.jsx # Conversational copilot
│   │   │   └── SessionHistorySidebar.jsx # Historical case manager
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global user state & JWT handling
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx     # Modern login with demo account autofill
│   │   │   ├── RegisterPage.jsx  # Practitioner onboarding
│   │   │   └── DashboardPage.jsx # Dual-column multimodal workspace
│   │   ├── App.jsx               # React Router layout
│   │   ├── index.css             # Glassmorphism & design system tokens
│   │   └── main.jsx              # React DOM bootstrap
│   ├── .env.example              # Frontend environment template
│   ├── package.json              # Frontend dependencies
│   ├── tailwind.config.js        # Custom dark & neon theme
│   └── vite.config.js            # Vite build & proxy settings
├── .gitignore
└── README.md
```

---

## ⚡ Prerequisites

Before running the application, ensure you have:
1. **Node.js**: Version 18.0.0 or higher.
2. **MongoDB** *(Optional)*: Local MongoDB or MongoDB Atlas URI. *If MongoDB is not installed, the platform automatically uses a built-in zero-config local JSON database fallback.*
3. **Google Gemini API Key** *(Optional for dev)*: Free key obtainable from [Google AI Studio](https://aistudio.google.com/). *If omitted, realistic simulated multimodal synthesis runs automatically.*

---

## 🚀 Quick Start (Linked Frontend & Backend at One Place)

You can run both Frontend and Backend together with a single unified command from the project root!

### Option 1: Unified Single-Command Development (Recommended)

1. **Install dependencies across both packages:**
   ```bash
   npm run setup
   ```

2. **Configure Backend Environment:**
   Create or edit `backend/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters
   GEMINI_API_KEY=AIzaSyYourActualGeminiApiKeyFromGoogleAIStudio
   GEMINI_MODEL=gemini-1.5-flash
   CLIENT_ORIGIN=http://localhost:5173
   ```

3. **Start both Backend and Frontend concurrently:**
   ```bash
   npm run dev
   ```
   * 🌐 **Frontend UI:** [http://localhost:5173](http://localhost:5173) (with live Vite HMR)
   * ⚙️ **Backend API:** [http://localhost:5000](http://localhost:5000)

---

### Option 2: Unified Production Mode (Single Port 5000)

Run the entire application (both React UI and Express API) on a single port:

```bash
# 1. Build frontend into static production bundle
npm run build

# 2. Start unified server
npm start
```

👉 Access the complete application at **`http://localhost:5000`** (Express serves the React client and all API endpoints from the same origin).

---

### Option 3: Separate Terminals

#### Terminal 1 — Backend:
```bash
cd backend
npm install
npm run dev
```

#### Terminal 2 — Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testing the Multimodal Workflow

1. Navigate to `http://localhost:5173` in your browser.
2. Click **"Fill Demo Account"** on the Sign In page (or register a new practitioner profile).
3. On the **Multimodal Ingestion** dashboard:
   - Select **Clinical / Healthcare** domain.
   - Drag and drop:
     - An **image** (e.g. Chest X-ray or handwritten clinical chart).
     - An **audio clip** (e.g. Doctor consultation voice recording in `.mp3` or `.wav`).
     - A **PDF report** (e.g. Blood lab panel or pathology report).
   - Enter an objective prompt: *"Correlate spoken consultation symptoms with lab biomarkers and check for dosage contradictions."*
   - Click **Run Unified Multimodal Synthesis**.
4. Explore the synthesized results:
   - **Executive Synthesis**: Cross-modal overview generated by Gemini.
   - **Cross-Modal Correlation**: Highlights discrepancies between what was spoken and what was written.
   - **Risk & Anomaly Alerts**: Flags contraindications or abnormal biomarker values.
   - **Interactive Copilot (Chat)**: Ask questions such as *"Did the doctor in the audio prescribe the same medication listed in the lab PDF?"*

---

## 📡 API Endpoints Reference

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user | No |
| `POST` | `/api/auth/login` | Login user & issue JWT token | No |
| `GET` | `/api/auth/me` | Fetch active user profile | Yes |
| `POST` | `/api/ai/process` | Upload multipart media & run Gemini synthesis | Yes |
| `GET` | `/api/ai/sessions` | Fetch list of past user multimodal cases | Yes |
| `GET` | `/api/ai/sessions/:id` | Fetch specific multimodal case & files | Yes |
| `POST` | `/api/ai/sessions/:id/chat` | Ask multi-turn question in multimodal context | Yes |
| `DELETE` | `/api/ai/sessions/:id` | Delete session and purge local files | Yes |
| `GET` | `/api/health` | Backend and Gemini readiness health check | No |

---

## 🌐 Production Deployment Guide

### Deploying the Backend (Render or Railway)

#### Option A: Render.com
1. Create a **New Web Service** and connect your repository.
2. Set the **Root Directory** to `backend`.
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add the following **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render default)
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `JWT_SECRET`: *A secure 64-character random string*
   - `GEMINI_API_KEY`: *Your Google Gemini API Key*
   - `GEMINI_MODEL`: `gemini-1.5-flash`
   - `CLIENT_ORIGIN`: *Your deployed Vercel frontend URL (e.g. https://mediomni.vercel.app)*
5. Deploy service. Note your backend URL (e.g., `https://mediomni-api.onrender.com`).

#### Option B: Railway.app
1. Create a **New Project** -> Deploy from GitHub Repo.
2. Set root directory to `backend`.
3. Add MongoDB plugin or provide external MongoDB Atlas URI.
4. Set environment variables identical to the list above.

---

### Deploying the Frontend (Vercel)

1. Create a **New Project** on [Vercel](https://vercel.com) and link your repository.
2. Set the **Framework Preset** to **Vite**.
3. Set the **Root Directory** to `frontend`.
4. Configure **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://mediomni-api.onrender.com/api` (your deployed backend URL)
5. Add a `vercel.json` in the `frontend/` directory for Single-Page Application (SPA) routing:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
6. Click **Deploy**. Your multimodal web app is now live!

---

## 💡 Troubleshooting & FAQ

- **Gemini API Key Issues**: If you see simulated responses, verify that `GEMINI_API_KEY` is saved without quotes or spaces in `backend/.env`.
- **Large Audio / Video Files**: For audio or video recordings longer than 5 minutes, ensure your server upload limit (`MAX_FILE_SIZE_MB`) is sized appropriately.
- **CORS Errors**: Ensure `CLIENT_ORIGIN` in `backend/.env` exactly matches your frontend protocol and port (e.g., `http://localhost:5173`).

---

## 📄 License
MIT © 2026 Prathmesh Vaidya
