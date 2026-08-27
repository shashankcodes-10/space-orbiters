# Space Orbiters

Space Orbiters is a space-exploration project with React frontends, a Node.js/Express backend, Socket.IO real-time chat, and PostgreSQL persistence.

## Architecture

```text
React main app ───────┐
                      │ HTTP
React solar system ───┼────────> Node.js + Express + Socket.IO
                      │                    │
Chat browser ─────────┘                    │ SQL
                                           ▼
                                      PostgreSQL
```

## Project Structure

```text
SPACE_ORBITERS/
├── frontend/
│   ├── main-app/          # Main React + Vite website
│   ├── solar-system/      # React + Three.js solar-system application
│   └── chatroom/          # HTML/CSS/JS chat client
│
├── backend/
│   ├── src/
│   │   ├── db/            # PostgreSQL connection pool
│   │   ├── routes/        # REST API routes
│   │   ├── socket/        # Socket.IO chat + PostgreSQL persistence
│   │   └── server.js      # Express + Socket.IO entry point
│   ├── package.json
│   └── .env.example
│
└── README.md
```

> **Note:** This repository currently contains application code only
> (`frontend/` and `backend/`). There is no `init/` folder, no
> `docker-compose.yml`, and no Dockerfiles at this stage — PostgreSQL
> setup and containerization are not included yet.

## Backend API

The backend runs on port `3000`.

- `GET /` — backend information
- `GET /api/health` — backend + PostgreSQL health
- `GET /api/planets` — PostgreSQL planet records
- `GET /api/users` — PostgreSQL users
- `GET /api/messages` — PostgreSQL chat history
- `GET /api/launches` — backend proxy for launch data
- `/chat/` — browser chat client

## PostgreSQL

The backend expects a PostgreSQL database with three tables: `users`, `planets`, and `messages`. Since this repository does not currently include schema/seed SQL files, you'll need to create these tables yourself before starting the backend — matching the columns referenced in `backend/src/routes/api.js` and `backend/src/socket/chat.js`:

- `users` — at minimum `id`, `username` (unique), `email`, `created_at`
- `planets` — at minimum `id`, `name`, `description`, `created_at`
- `messages` — at minimum `id`, `user_id` (references `users.id`), `message`, `created_at`

Chat messages are persisted in PostgreSQL instead of being kept only in memory.

## Run (Without Docker)

### 1. Set up PostgreSQL

Create a database named `space_orbiters` and manually create the `users`, `planets`, and `messages` tables described above (and seed `planets` with data if you want it populated).

### 2. Start backend

```bash
cd backend
npm install
cp .env.example .env
npm start
```

### 3. Start main frontend

```bash
cd frontend/main-app
npm install
npm run dev
```

### 4. Start solar-system frontend

```bash
cd frontend/solar-system
npm install
npm run dev
```

## Environment Variables

Backend:

```text
PORT=3000
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=space_orbiters
POSTGRES_USER=space_orbiters
POSTGRES_PASSWORD=change_me
```

Main frontend:

```text
VITE_API_URL=http://localhost:3000/api
```

## Data Flow

### Planet data

```text
Main React frontend
        ↓
GET /api/planets
        ↓
Express backend
        ↓
PostgreSQL
        ↓
planets table
```

### Chat

```text
Chat browser
     ↓
Socket.IO
     ↓
Node.js backend
     ↓
PostgreSQL
     ↓
messages + users
```

### Launch data

```text
Main React frontend
        ↓
GET /api/launches
        ↓
Node.js backend
        ↓
External launch API
```

External NASA/space resources used by individual existing UI features remain external resources; PostgreSQL is the application's persistent database layer.

## Technology Stack

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Three.js
- React Three Fiber
- Material UI
- D3.js
- Axios

### Backend

- Node.js
- Express
- Socket.IO
- PostgreSQL
- `pg`
- CORS
- dotenv

### Database

- PostgreSQL 16
- Manual schema setup (no SQL init scripts included yet)

## Not Yet Included

- `init/01-schema.sql` and `init/02-seed.sql` (PostgreSQL schema/seed scripts)
- `docker-compose.yml`
- Backend and frontend `Dockerfile`s
- Nginx configs for production frontend serving
