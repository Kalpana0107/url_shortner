# URL Shortener (SnapLink)

A full-stack URL shortener: paste a long URL, get a short link that redirects to it, and track how many times each link is clicked. Built as a learning project, one concept at a time.

## Features

- Shorten any http/https URL into a 6-character code
- Redirect from `/:shortCode` to the original URL
- Click counter that increments on every redirect
- Duplicate short codes are detected and regenerated automatically
- React dashboard: create links, copy them, see total links and total clicks

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React + Vite, Tailwind CSS, lucide-react |
| Backend  | Node.js + Express 5 |
| Database | PostgreSQL (via `pg`) |
| Config   | dotenv, cors |

## Project Structure

```
url_shortner/
├── backend/
│   ├── server.js      # Express app and all routes
│   ├── db.js          # PostgreSQL connection pool
│   └── package.json
├── frontend/
│   ├── src/App.jsx    # Landing page + dashboard
│   └── package.json
└── README.md
```

## Database Schema

```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_url VARCHAR(6) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  clicks INTEGER NOT NULL DEFAULT 0
);
```

## API

### `POST /api/shorten`
Creates a short link.

Request:
```json
{ "url": "https://example.com" }
```

Response `201 Created`:
```json
{
  "id": 1,
  "original_url": "https://example.com",
  "short_url": "bzu0Ai",
  "created_at": "2026-11-14T10:00:00.000Z",
  "clicks": 0
}
```

Errors: `400` if the URL is missing or invalid, `500` on server error.

### `GET /api/urls`
Returns all links, newest first (used by the dashboard).

### `GET /:shortCode`
Increments the click count and redirects to the original URL.
Returns `404` if the code does not exist.

## Setup

### Prerequisites
- Node.js
- PostgreSQL (with a database named `url_shortener` and the `urls` table above)

### Backend
```bash
cd backend
npm install
```

Create `backend/.env` (never commit this file):
```
user=postgres
host=localhost
port=5432
password=your_postgres_password
database=url_shortener
SERVER_PORT=5000
```

Start the server:
```bash
node server.js
```
Runs on `http://localhost:5000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the URL Vite prints (usually `http://localhost:5173`). The backend must be running.

## Concepts Practiced

- Express routing, middleware order, and `express.json()`
- Path parameters (`req.params`) and `res.redirect`
- Parameterized SQL queries (`$1`, `$2`) to prevent SQL injection
- `INSERT ... RETURNING` and handling unique-constraint errors (Postgres code `23505`)
- `async`/`await` with `try/catch` in every route
- CORS between a Vite frontend and an Express backend
- React state, `useEffect`, and `fetch` against a REST API

## Roadmap

- [x] Express server, JSON handling, short code generator
- [x] PostgreSQL setup and Node connection
- [x] Store URLs with parameterized queries
- [x] Redirect route and click counter
- [x] URL validation and duplicate-code retry
- [x] React dashboard
- [x] Restrict accepted protocols to http/https
- [x] Cap the duplicate-code retry loop
- [x] Move the API base URL in the frontend to an environment variable
- [x] Link expiration and custom aliases
- [x] Authentication and rate limiting
- [x] Redis caching
- [x] Deployment
- [x] Tests
