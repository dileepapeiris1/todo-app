# TODO App — Backend

Node.js + Express.js REST API backed by MongoDB.

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the server listens on |
| `MONGODB_URI` | `mongodb://localhost:27017/todoapp` | MongoDB connection string |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |
| `NODE_ENV` | `development` | Environment |

### MongoDB Connection

- **Local**: Set `MONGODB_URI=mongodb://localhost:27017/todoapp`
- **Atlas**: Set `MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/todoapp`

## Running

```bash
# Development (hot-reload)
npm run dev

# Production
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/todos` | Get all todos (newest first) |
| POST | `/api/todos` | Create a todo `{ title, description? }` |
| PUT | `/api/todos/:id` | Update title/description |
| PATCH | `/api/todos/:id/done` | Toggle done status |
| DELETE | `/api/todos/:id` | Delete a todo |

## Assumptions & Limitations

- No authentication — all todos are global (single-user scope)
- Input validated server-side via `express-validator`; title max 200 chars, description max 1000 chars
- Mongoose `timestamps: true` adds `createdAt` / `updatedAt` automatically