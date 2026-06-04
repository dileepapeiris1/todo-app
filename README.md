# TrackLog

A full-stack task management app. Sign in with Google, add todos with due dates, search across your list, and track what is done.

---

## What is in this repo

This is a pnpm monorepo with two packages:

```
todo-app/
├── backend/      Express + TypeScript REST API
├── frontend/     React + Vite web app
├── package.json  workspace root (dev scripts)
└── pnpm-workspace.yaml
```

→ [Backend README](./backend/README.md)
→ [Frontend README](./frontend/README.md)

---

## Monorepo setup

The repo uses pnpm workspaces. Both packages manage their own dependencies and scripts — the workspace root just provides shortcuts to run them together.

```bash
# install everything in one go
pnpm install

# run both dev servers in parallel
pnpm dev

# run only the backend
pnpm dev:backend

# run only the frontend
pnpm dev:frontend
```

The backend runs on `http://localhost:5000` and the frontend on `http://localhost:5173`.

---

## Architecture overview

```
┌──────────────────────────────────────┐
│              Browser                 │
│   React 19 · Vite · TanStack Query   │
│   Tailwind CSS v4 · TypeScript       │
└───────────────────┬──────────────────┘
                    │ HTTPS / JSON
                    │
┌───────────────────▼──────────────────┐
│             Express API              │
│   Node.js · TypeScript · Mongoose    │
│   JWT auth · express-validator       │
└───────────────────┬──────────────────┘
                    │ Mongoose
                    │
┌───────────────────▼──────────────────┐
│              MongoDB                 │
│   Atlas or local mongod              │
└──────────────────────────────────────┘
```

**Frontend** is a single-page app. It authenticates with Google using the Identity Services SDK, exchanges the Google credential for a JWT from the backend, and stores that JWT in localStorage. All subsequent API calls attach it as a Bearer token.

**Backend** is a stateless REST API. It verifies the Google credential server-side, issues a JWT, and from then on only checks that JWT. No session state is kept on the server.

**Database** is MongoDB. The Mongoose schemas handle validation at the database layer too, though the main validation runs at the Express middleware layer before requests reach the service.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend framework | React 19 with React Compiler |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 (infinite scroll) |
| Frontend testing | Vitest + Testing Library |
| Backend framework | Express 4 |
| Backend language | TypeScript |
| Database | MongoDB via Mongoose |
| Auth | Google OAuth 2.0 + JWT |
| Backend validation | express-validator |
| Deployment | Choreo (WSO2) |
| Package manager | pnpm (workspaces) |

---

## Deployment

The backend is deployed on Choreo as a Node.js service connected to a MongoDB Atlas database.

The frontend is deployed on Choreo as a web application with these build settings:

- **Build command:** `npm run build`
- **Build output:** `dist`
- **Node version:** 20

Each component has its own Choreo component definition under `backend/.choreo/`.

---

## Environment variables

Both packages need their own `.env` file. Copy the examples and fill in the values:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

See each package README for the full variable reference.
