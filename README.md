# URL Shortener

A backend learning project: paste a long URL, get back a short one that redirects to it. Built one concept at a time.

## Tech Stack

| Layer    | Technology       |
|----------|------------------|
| Backend  | Node.js + Express |
| Database | PostgreSQL (via `pg`) |
| Config   | dotenv |
| Frontend | React + Vite (not started yet) |

## Status

Actively in progress. Backend can accept a URL, generate a short code, and store it in PostgreSQL. Frontend, redirect route, and validation are not built yet.

## Progress Log

- [x] **Express server** — basic server running on port 5000, `GET /` responds
- [x] **JSON handling** — `express.json()` middleware wired in; `POST /api/shorten` reads `req.body.url`
- [x] **Short code generator** — `generateShortCode()` produces a random 6-character alphanumeric code
- [x] **PostgreSQL setup** — local Postgres installed, `url_shortener` database created, `urls` table created via hand-written `CREATE TABLE`
- [x] **SQL CRUD practiced manually** — INSERT / SELECT / UPDATE / DELETE run directly in pgAdmin's Query Tool
- [x] **Node ↔ PostgreSQL connection** — `pg` Pool configured via `.env` (`dotenv`), connection verified with `SELECT NOW()`
- [x] **`.env` excluded from git** — credentials never committed
- [ ] **`POST /api/shorten` stores to database** — route rewritten to insert via parameterized query (`$1`, `$2`) and return the short code; connecting piece just finished, being tested now
- [ ] **Redirect route** — `GET /:shortCode` looking up the original URL and redirecting
- [ ] **Input validation & error handling**
- [ ] **React frontend**
- [ ] **Click analytics, expiration, custom aliases, auth, security, caching, deployment** — later stages of the roadmap, not started

## Database Schema

```sql
CREATE TABLE urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_url VARCHAR(6) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## API (so far)

### `POST /api/shorten`
Accepts a JSON body and returns a generated short code.

**Request**
```json
{ "url": "https://example.com" }
```

**Response**
```json
{ "shortUrl": "abc123" }
```

## Setup

1. Clone the repo and install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in `backend/` (not committed — see `.gitignore`):
   ```
   user=postgres
   host=localhost
   port=5432
   password=your_postgres_password
   database=url_shortener
   ```
3. Make sure PostgreSQL is running and the `urls` table exists (see schema above).
4. Start the server:
   ```bash
   node server.js
   ```
   Server runs on `http://localhost:5000`.

