# CP Analytics AI

AI-powered Competitive Programming Analytics — FastAPI backend + React frontend monorepo.

```
cp-analytics/
├── backend/          FastAPI + PostgreSQL + Redis
├── frontend/         React + Vite + Tailwind
├── docker-compose.yml
└── README.md
```

---

## Quick start — Docker (recommended)

```bash
docker-compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:3000  |
| Backend  | http://localhost:8000  |
| API docs | http://localhost:8000/docs |
| DB       | localhost:5432         |

---

## Local dev (without Docker)

### 1. Backend

```bash
cd backend

# Create & activate virtualenv
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate

# Install deps
pip install -r requirements.txt

# Copy env and edit as needed
cp .env.example .env

# Start (requires Postgres + Redis running locally)
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

Vite proxies `/auth`, `/user`, `/recommend`, `/stats` → `http://localhost:8000` automatically.

---

## API routes

| Method | Route                      | Description                        |
|--------|----------------------------|------------------------------------|
| POST   | `/auth/signup`             | Register new user                  |
| POST   | `/auth/login`              | Login → JWT token                  |
| GET    | `/user/analysis/{handle}`  | Topic analysis + progress          |
| GET    | `/user/progress/{handle}`  | Daily accuracy array               |
| GET    | `/recommend/{user_id}`     | AI-ranked problem recommendations  |
| GET    | `/stats/{user_id}`         | User's daily stats                 |

---

## Environment variables

All backend env vars live in `backend/.env` (copy from `.env.example`):

| Variable                    | Default                                               |
|-----------------------------|-------------------------------------------------------|
| `DATABASE_URL`              | `postgresql://postgres:password@localhost:5432/cp_analytics` |
| `SECRET_KEY`                | *(change in production)*                              |
| `ALGORITHM`                 | `HS256`                                               |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `60`                                                |
| `REDIS_HOST`                | `localhost`                                           |
| `REDIS_PORT`                | `6379`                                                |
