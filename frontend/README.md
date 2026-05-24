# CP Analytics AI — Frontend

React + Tailwind + dark-mode frontend for the CP Analytics AI FastAPI backend.

## Project structure

```
src/
├── api/
│   ├── client.js          # Axios instance with JWT interceptor
│   └── endpoints.js       # One function per backend route
├── components/
│   ├── HandleSearch.jsx   # Reusable handle search bar
│   ├── ProblemCard.jsx    # Single recommended problem
│   ├── Sidebar.jsx        # Navigation sidebar
│   ├── TopicTable.jsx     # Weak/strong topic table
│   └── UI.jsx             # Spinner, StatCard, AccuracyBar, RatingBadge, …
├── context/
│   └── AuthContext.jsx    # JWT token + user stored in localStorage
├── hooks/
│   └── useFetch.js        # Generic async fetch hook (data/loading/error)
├── pages/
│   ├── AuthPage.jsx       # Login + signup (POST /auth/login, /auth/signup)
│   ├── Dashboard.jsx      # Overview (GET /user/analysis/{handle})
│   ├── AnalysisPage.jsx   # Topic filter table (GET /user/analysis/{handle})
│   ├── ProgressPage.jsx   # Daily accuracy chart (GET /user/progress/{handle})
│   ├── RecommendPage.jsx  # AI problems (GET /recommend/{user_id})
│   └── StatsPage.jsx      # Daily stats (GET /stats/{user_id})
├── App.jsx                # Router + auth guard
├── index.css              # Tailwind + custom design tokens
└── main.jsx               # Entry point
```

## Setup

```bash
npm install
npm run dev        # http://localhost:3000
```

Make sure the FastAPI backend is running on **http://localhost:8000**.  
The Vite dev server proxies `/auth`, `/user`, `/recommend`, `/stats` → backend automatically.

## Build for production

```bash
npm run build      # output → dist/
```

Set `VITE_API_BASE` or update `vite.config.js` proxy target for a different backend URL.
