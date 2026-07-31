# 🧭 AI Learning Platform (Waypoint)

An AI-powered personalized learning platform that turns a learning goal into a structured, trackable curriculum. Tell it what you want to learn, your experience level, and how much time you have — it generates a topic-by-topic roadmap using a local LLM, then lets you work through it with progress tracking and auto-generated quizzes.

The backend service is called **AI Learning Platform**; the React frontend that ships with it is branded **Waypoint**.

---

## 📌 Overview

Most learning platforms hand everyone the same static syllabus. This project instead generates a roadmap on demand: a locally-run LLM (Llama 3 via Ollama) writes a topic/subtopic breakdown for the learner's goal, and the backend turns that into real database records — a `LearningPath` with ordered `Topic`s and `SubTopic`s — that the learner can track day to day.

Core loop:
1. **Register / log in** (JWT-based auth).
2. **Generate a learning path** — describe a goal, level, and duration; the LLM designs the curriculum.
3. **Work through subtopics**, marking them complete as you go.
4. **Take AI-generated quizzes** per subtopic/topic to check understanding, and see scores on a results dashboard.

---

## ✨ Features

### 🔐 Authentication
- Registration and login with hashed passwords (bcrypt via Passlib).
- JWT bearer tokens (`python-jose`) issued on register/login and required on protected routes.
- Ownership checks — a user can only generate/view their own learning paths and dashboards (`email != current_user.email` → `403`).

### 🤖 AI-Generated Learning Paths
- `POST /generate-learning-path` accepts a goal, experience level, hours/day, duration in weeks, and a start date.
- A prompt template (`app/llm/learning_path_prompt.py`) asks the model for a JSON curriculum: topics that progress beginner → advanced, each with 3–5 subtopics, a difficulty level, an order index, and an estimated day count.
- `app/llm/llm_provider.py` calls a **local Llama 3 model through Ollama**, then extracts and repairs the JSON out of the raw model output (strips code fences, trims trailing commas/control characters) before parsing it.
- The parsed plan is persisted as a `LearningPath` → `Topic` → `SubTopic` tree via `tracking_service.create_learning_path`.

### 📊 Progress Tracking
- `GET /dashboard/{email}` returns the learner's learning paths with topic/subtopic status.
- `PUT /subtopic/{subtopic_id}/complete` marks a subtopic done and rolls that progress up to the parent topic.

### 📝 AI-Generated Quizzes
- `app/services/quiz_service.py` generates multiple-choice quizzes per subtopic/topic using the same LLM pipeline, storing questions in the `questions` table.
- `GET /quiz/{quiz_id}` fetches a quiz; `POST /quiz/{quiz_id}/submit` grades submitted answers and records a `QuizResult`.
- `GET /quiz/dashboard/{email}` returns quiz history/scores for the logged-in learner.

### 🖥️ Frontend (Waypoint)
- React 18 + TypeScript + Vite + Tailwind CSS, built as a single-page app (originally scaffolded with Bolt).
- Screens/components: `AuthScreen` (register/login with learning-style selection), `Dashboard` (active learning paths + progress), `RoutePath` (topic/subtopic roadmap view), `GeneratePathModal` (new learning path form), `QuizModal` (take a quiz), plus a small `Settings` panel to point the app at a different FastAPI base URL.
- Talks to the backend over a typed `fetch` wrapper (`src/api.ts`) using a bearer token stored client-side.
- Users choose a **learning style / personality mode** at signup — `fast-track`, `deep-mastery`, or `practical-only` — stored on the `User` record for future personalization.

---

## 🏗️ System Architecture

```text
React + TypeScript frontend (Waypoint)
        │  fetch / JWT bearer token
        ▼
FastAPI backend (app/main.py)
        │
        ├── Auth API        → JWT issuance, password hashing, current-user resolution
        ├── Learning Path API → builds LLM prompt, parses response, persists roadmap
        ├── Tracking API     → dashboard data, subtopic completion
        ├── Quiz API         → quiz fetch, grading, quiz history
        │
        ▼
Ollama (running Llama 3 locally)
        │
        ▼
PostgreSQL (via SQLAlchemy ORM)
```

---

## 🛠️ Technology Stack

**Backend:** FastAPI, Python, SQLAlchemy (ORM), Pydantic, Uvicorn, Alembic (migrations present in requirements)

**Database:** PostgreSQL, `asyncpg` / `psycopg2-binary`

**AI / LLM:** Ollama running Llama 3 (local inference — no external LLM API calls), plus `transformers`, `torch`, and `accelerate` in requirements for future model work

**Auth & Security:** JWT (`python-jose`), Passlib + Bcrypt password hashing

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, `lucide-react` icons, `@supabase/supabase-js` (available for future use)

**DevOps:** Docker / Docker Compose (scaffolded)

---

## 📂 Project Structure

```text
ai-learning-platform/
│
├── app/                          # FastAPI backend
│   ├── main.py                   # App entrypoint, router registration, CORS, table creation
│   ├── config.py                 # Loads DATABASE_URL from .env
│   ├── dependencies.py
│   │
│   ├── api/                      # Route handlers
│   │   ├── auth.py                #   /auth/register, /auth/login, /auth/logout, get_current_user
│   │   ├── learning_path.py       #   /generate-learning-path
│   │   ├── tracking.py            #   /dashboard/{email}, subtopic completion
│   │   └── quiz.py                #   /quiz/{id}, /quiz/{id}/submit, /quiz/dashboard/{email}
│   │
│   ├── core/                      # Security & token helpers
│   │   ├── security.py            #   password hashing, token creation
│   │   └── auth.py                #   token creation/verification
│   │
│   ├── db/
│   │   ├── database.py            #   SQLAlchemy engine + declarative Base
│   │   └── session.py             #   DB session factory / get_db dependency
│   │
│   ├── llm/
│   │   ├── llm_provider.py        #   Ollama/Llama 3 call + robust JSON extraction
│   │   └── learning_path_prompt.py #  Prompt template for curriculum generation
│   │
│   ├── models/                    # SQLAlchemy ORM models
│   │   ├── user.py                #   User (name, email, password_hash, personality_mode)
│   │   ├── learning_plan.py       #   LearningPath (status: active/completed/paused)
│   │   ├── topic.py                #   Topic (difficulty, order, estimated_days, status)
│   │   ├── subtopic.py             #   SubTopic (status)
│   │   ├── quiz.py                 #   Quiz, Question
│   │   └── quiz_result.py          #   QuizResult (score, total)
│   │
│   ├── schemas/                   # Pydantic request/response models
│   │   ├── user_schema.py, topic_schema.py, quiz_schema.py, learning_path_schema.py
│   │
│   └── services/                  # Business logic
│       ├── quiz_service.py         #   quiz generation, grading, history
│       └── foundation/
│           └── tracking_service.py #   learning path creation, dashboard, completion
│
├── frontend/
│   └── project/                  # React + TypeScript + Vite app ("Waypoint")
│       ├── src/
│       │   ├── App.tsx, main.tsx, auth.tsx, api.ts, types.ts
│       │   └── components/
│       │       ├── AuthScreen.tsx        # Login/register + learning-style picker
│       │       ├── Dashboard.tsx         # Active paths, results view
│       │       ├── RoutePath.tsx         # Topic/subtopic roadmap
│       │       ├── GeneratePathModal.tsx # New learning path form
│       │       ├── QuizModal.tsx         # Quiz-taking UI
│       │       └── ui.tsx                # Shared UI primitives
│       ├── tailwind.config.js, vite.config.ts, package.json
│       └── .bolt/                # Original Bolt scaffold metadata
│
├── requirements.txt
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/Prajaktah23/ai-learning-platform.git
cd ai-learning-platform
```

### 2. Backend — create a virtual environment
```bash
python -m venv venv
```
Activate it:
```bash
# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

### 3. Install backend dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure PostgreSQL
Create a database:
```sql
CREATE DATABASE ai_learning_platform;
```
Create a `.env` file in the project root with:
```env
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/ai_learning_platform
```
`app/config.py` reads this at startup and will raise an error if it's missing.

### 5. Install Ollama and pull Llama 3
```bash
ollama pull llama3
ollama run llama3   # sanity check
```
The backend calls Ollama's local API directly, so Ollama must be running before you generate a learning path or quiz.

### 6. Run the backend
```bash
uvicorn app.main:app --reload
```
- API: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`

Tables are created automatically on startup via `Base.metadata.create_all`.

### 7. Run the frontend
```bash
cd frontend/project
npm install
npm run dev
```
By default Waypoint talks to `http://localhost:8000`; this can be changed at runtime from the in-app **Settings** panel (stored in `localStorage`) if your API is running elsewhere.

---

## 🔑 API Reference

### Authentication
| Method | Endpoint         | Notes |
|--------|------------------|-------|
| POST   | `/auth/register` | Body: name, email, password, personality_mode. Returns JWT. |
| POST   | `/auth/login`    | Query params: email, password. Returns JWT. |
| POST   | `/auth/logout`   | Stateless — client discards token. |

### Learning Path
| Method | Endpoint                   | Query params |
|--------|-----------------------------|--------------|
| POST   | `/generate-learning-path`  | `email`, `goal`, `level`, `hours_per_day`, `duration_weeks`, `start_date` — requires bearer token, must match the authenticated user's email |

### Tracking
| Method | Endpoint                              | Notes |
|--------|-----------------------------------------|-------|
| GET    | `/dashboard/{email}`                   | Learner's learning paths + progress. Requires bearer token matching the email. |
| PUT    | `/subtopic/{subtopic_id}/complete`     | Marks a subtopic complete for the authenticated user. |

### Quiz
| Method | Endpoint                     | Notes |
|--------|--------------------------------|-------|
| GET    | `/quiz/{quiz_id}`             | Fetch quiz questions. |
| POST   | `/quiz/{quiz_id}/submit`      | Body: `{ "answers": { ... } }`. Grades and stores a `QuizResult`. |
| GET    | `/quiz/dashboard/{email}`     | Quiz history/scores for the authenticated user. |

All protected routes expect `Authorization: Bearer <token>`.

---

## 🔒 Security Notes

- Passwords are hashed with bcrypt before storage — never stored or logged in plain text.
- JWTs are signed with HS256 and expire after 60 minutes.
- Every user-scoped endpoint checks that the requested `email` matches the authenticated user, preventing one account from reading or modifying another's data.
- **Before deploying this beyond local development:** move the hardcoded secret keys in `app/core/auth.py` / `app/core/security.py` into environment variables, and restrict the wide-open CORS (`allow_origins=["*"]`) in `app/main.py` to known frontend origins.

---

## 🚀 Possible Next Steps

- Deduplicate the two overlapping JWT/security helper modules (`app/core/auth.py` and `app/core/security.py`) into one.
- Move secret keys and CORS origins to environment configuration.
- Wire up `docker-compose.yml` (currently empty) for one-command local startup of the API, Postgres, and Ollama.
- Use the stored `personality_mode` to actually shape prompt generation (fast-track vs. deep-mastery vs. practical-only currently only affects UI copy).
- Add automated tests around JSON parsing in `llm_provider.py`, since LLM output shape can vary.
- Support additional LLM backends (OpenAI, Gemini, Claude) alongside local Ollama.

---

## 👨‍💻 Author

**Prajakta Hake** — Associate Software Engineer, AI & Generative AI Developer

---

## 📜 License

MIT License.