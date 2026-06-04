# TrackLog

A full-stack todo app. Sign in with Google, add todos with due dates, search across your list, and track what is done.

---

## What is in this repo

This is a pnpm monorepo with three packages:

```
todo-app/
├── backend/      Express + TypeScript REST API
├── webapp/       React + Vite web app
├── mobileapp/    Expo + React Native mobile app
├── package.json  workspace root (dev scripts)
└── pnpm-workspace.yaml
```

→ [Backend README](./backend/README.md)
→ [Webapp README](./webapp/README.md)
→ [Mobile App README](./mobileapp/README.md)

---

## Monorepo setup

The repo uses pnpm workspaces. All packages manage their own dependencies and scripts — the workspace root just provides shortcuts to run them.

```bash
# install everything in one go
pnpm install

# run dev servers in parallel
pnpm dev

# run only the backend
pnpm dev:backend

# run only the webapp
pnpm dev:webapp

# run only the mobile app
pnpm dev:mobile
```

The backend runs on `http://localhost:5000` and the webapp on `http://localhost:5173`.

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

**Webapp** is a single-page web app. It authenticates with Google using the Identity Services SDK, exchanges the Google credential for a JWT from the backend, and stores that JWT in localStorage. All subsequent API calls attach it as a Bearer token.

**Mobileapp** is an Expo React Native mobile application. It uses Expo Auth Session for Google OAuth authentication, exchanges the credentials with the backend for a JWT, and stores it in secure storage.

**Backend** is a stateless REST API. It verifies the Google credential server-side, issues a JWT, and from then on only checks that JWT. No session state is kept on the server.

**Database** is MongoDB. The Mongoose schemas handle validation at the database layer too, though the main validation runs at the Express middleware layer before requests reach the service.

---

## Tech stack

| Layer | Technology |
|---|---|
| Webapp framework | React 19 with React Compiler |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Data fetching | TanStack Query v5 (infinite scroll) |
| Webapp testing | Vitest + Testing Library |
| Mobile framework | React Native with Expo 52 |
| Backend framework | Express 4 |
| Backend language | TypeScript |
| Database | MongoDB via Mongoose |
| Auth | Google OAuth 2.0 + JWT |
| Backend validation | express-validator |
| Package manager | pnpm (workspaces) |

---

## Environment variables

The backend, webapp, and mobileapp each need their own `.env` file. Copy the examples and fill in the values:

```bash
cp backend/.env.example backend/.env
cp webapp/.env.example webapp/.env
cp mobileapp/.env.example mobileapp/.env
```

See each package README for the full variable reference.
