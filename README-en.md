# 🐾 Pituti App

> A pet care management application.
> Track vaccines, medications, symptoms, daily care routines and vet appointments.

---

## 🔗 Project URLs

| Resource | URL |
|----------|-----|
| **Frontend** | https://pituti-app.vercel.app |
| **API** | https://pituti-api.vercel.app |
| **Health Check** | https://pituti-api.vercel.app/api/health |
| **Repository** | https://github.com/thamih-b/Pituti_App |
| **Trello Board** | https://trello.com/invite/b/69d1023913066206b5cd5e75/ATTIe0e0e73d3b37bfb345fdb0ec60f7e0cb7485F683/pituti-app |

---

## 🚀 Local Installation

### Prerequisites
- Node.js >= 20
- npm >= 9

### Frontend
```bash
# In the project root
npm install
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd server
npm install
npm run dev
# → http://localhost:3001
# → http://localhost:3001/api/health
```

### Environment Variables

Create a `.env.development` file in the project root:
```env
VITE_API_URL=http://localhost:3001/api
```

---

## 🏗️ Project Structure

```
PITUTI_APP/
├── src/                  # Frontend — React + Vite + TypeScript
│   ├── api/              # API clients (axios)
│   ├── components/       # Reusable components
│   ├── context/          # Global state (React Context)
│   ├── hooks/            # Custom hooks
│   ├── pages/            # Application pages
│   └── styles/           # Global CSS and variables
│
├── server/               # Backend — Node.js + Express
│   ├── controllers/      # HTTP handlers
│   ├── routes/           # Route definitions
│   ├── services/         # Business logic
│   ├── middleware/       # CORS, validation, error handling
│   ├── data/             # In-memory store + seed data
│   └── validators/       # Zod schemas
│
├── docs/                 # Documentation
│   ├── deployment.md     # Deployment guide
│   └── testing.md        # Testing & QA
│
├── vercel.json           # Vercel config (frontend)
└── server/vercel.json    # Vercel config (backend)
```

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite |
| State Management | React Context + useReducer |
| Styling | CSS Variables, Dark Mode |
| HTTP Client | Axios |
| Backend | Node.js 20, Express 4 |
| Validation | Zod |
| Deployment | Vercel |

---

## 📋 Features

- 🐶🐱 Manage multiple pets
- 💉 Vaccine records and calendar
- 💊 Medication tracking (active & history)
- 🩺 Symptom logging and resolution
- 🛁 Daily care routines with progress tracking
- 🏥 Vet contacts and appointment management
- 🌙 Dark mode
- 📱 Fully responsive (mobile + desktop)
- 🌍 Multi-language support (ES / EN / PT)

---

## 📚 Documentation

- [Deployment Guide](docs/deployment.md)
- [Testing & QA](docs/testing.md)

---

## 📌 Project Management

Task tracking, sprints and development progress are managed on Trello:

🔗 [Pituti App — Trello Board](https://trello.com/invite/b/69d1023913066206b5cd5e75/ATTIe0e0e73d3b37bfb345fdb0ec60f7e0cb7485F683/pituti-app)

The board includes:
- Feature backlog
- Tasks in progress
- Completed task history
- Design notes and technical decisions

---

## ⚖️ Copyright & License

Copyright © 2026 **thamih-b**. All rights reserved.

**Reproduction, distribution or use of this project**, in whole or in part — including its source code, visual design, documentation or any associated content — is strictly prohibited by any means or in any form, for any purpose (commercial, educational or personal), without the prior written permission of the author.

This includes, without limitation:
- Copying, modifying or distributing the source code
- Using the visual design or project identity
- Publishing derivative works, forks or adaptations
- Using this project as a base for other works

To request permission, contact the author via the repository: https://github.com/thamih-b/Pituti_App
