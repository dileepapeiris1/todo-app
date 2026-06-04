# TrackLog — Backend

Node.js REST API for the TrackLog task manager. Built with Express, TypeScript, and MongoDB.

---

## Getting started

Prerequisites: Node.js 18+, MongoDB (local or Atlas), a Google Cloud project with OAuth configured.

```bash
# install dependencies
npm install

# copy the example env and fill it in
cp .env.example .env

# start the dev server
npm run dev
```

The server starts on `http://localhost:5000` by default.

---

## Environment variables

Create a `.env` file at the root of the backend folder. The app refuses to start if any required variable is missing.

```
JWT_SECRET=some_long_random_string_here
GOOGLE_CLIENT_ID=your_google_oauth_client_id

# optional — defaults shown
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todoapp
ALLOWED_ORIGINS=http://localhost:5173
NODE_ENV=development
```

**JWT_SECRET** — used to sign and verify tokens. Make it long and random. Do not reuse between environments.

**GOOGLE_CLIENT_ID** — from the Google Cloud Console. The app only does server-side token verification so you do not need a client secret here.

---

## MongoDB

**Running locally:** Install MongoDB Community Edition and start `mongod`. The default URI `mongodb://localhost:27017/todoapp` works without any extra config. The database and collection are created automatically on first write.

**Using Atlas:** Paste your Atlas connection string into `MONGODB_URI`. Make sure your IP is whitelisted in the Atlas network access settings.

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/todoapp?retryWrites=true&w=majority
```

The app uses Mongoose, so there is no manual collection creation needed.

---

## Running tests

```bash
npm test
```

Uses Jest with ts-jest. Tests live in the `tests/` folder.

---

## Project structure

```
src/
├── server.ts                 entry point — validates env, connects DB, starts Express
├── app.ts                    wires up middleware and mounts route handlers
├── config/
│   └── db.ts                 Mongoose connect and disconnect helpers
├── constants/
│   ├── auth.ts               JWT expiry (7 days)
│   ├── config.ts             default port, URI, rate limit window values
│   ├── errors.ts             shared error message strings used across the app
│   ├── http.ts               HttpStatus enum (200, 201, 400, 401, 404, 500)
│   ├── models.ts             Mongoose model name constants
│   ├── pagination.ts         DEFAULT_PAGINATION_OFFSET and DEFAULT_PAGINATION_LIMIT
│   └── sort.ts               VALID_SORT_BY and VALID_SORT_ORDER whitelists
├── controllers/
│   ├── auth.controller.ts    handles Google sign-in and JWT issuance
│   └── todo.controller.ts    CRUD, search, toggle done
├── middlewares/
│   ├── authenticate.ts       verifies Bearer token, attaches userId to req
│   ├── errorHandler.ts       global error handler — converts Mongoose errors too
│   ├── requestLogger.ts      logs every request with method, path, status, duration
│   └── requestValidator.ts   runs express-validator chains, returns 400 on failure
├── models/
│   ├── todo.model.ts         Mongoose schema for todos
│   └── user.model.ts         Mongoose schema for users
├── routes/
│   ├── auth.routes.ts        POST /api/v1/auth/google
│   └── todo.routes.ts        all todo endpoints
├── services/
│   └── service.ts            all database logic lives here, controllers just call this
├── types/
│   ├── error.ts              ErrorResponse, ValidationErrorResponse
│   ├── pagination.ts         PaginatedResult<T>
│   ├── request.ts            CreateTodoBody, UpdateTodoBody, SearchTodoBody, TodoIdParam
│   ├── sort.ts               SortBy and SortOrder types
│   ├── todo.ts               ITodo and ITodoDocument
│   └── user.ts               IUser, AuthResponse, JwtPayload
└── utils/
    ├── logger.ts             Winston — pretty in dev, JSON in prod
    ├── response.ts           converts express-validator result into typed shape
    └── validation.ts         reusable express-validator rule chains
```

---

## How a request flows

1. Request arrives at Express
2. `authenticate` middleware verifies the JWT and attaches `req.userId`
3. Validation middleware runs the relevant field checks
4. Controller reads query or body params and calls the service layer
5. Service runs the Mongoose query and returns data
6. Controller formats and sends the response

Controllers never write Mongoose queries directly. All database access goes through `services/service.ts`. This makes it easy to test the service functions independently and keeps the controllers clean.

---

## Architecture notes

### Pagination

All list endpoints use offset-based pagination. The client sends `offset` (records to skip) and `limit` (records to return). The response includes `total` so the client knows if there are more pages.

```
GET /api/v1/todos?offset=0&limit=10&sortBy=dueDate&sortOrder=asc
→ { data: [...], total: 47, offset: 0, limit: 10 }
```

Offset pagination was chosen over page numbers because it works naturally with infinite scroll. The client calculates `hasMore = offset + data.length < total` and loads the next batch by incrementing offset.

### Search

`POST /api/v1/todos/search` takes `{ searchQuery, offset, limit }`. It runs a case-insensitive regex against both `title` and `description`. Special characters in the query are escaped before the regex is built to avoid ReDoS issues.

### Sorting

The list endpoint accepts `sortBy` (createdAt | dueDate | title) and `sortOrder` (asc | desc). Values are checked against whitelist arrays before being passed to Mongoose. Unknown values fall back to `createdAt desc`.

### Authentication

Google OAuth 2.0. The client (webapp or mobileapp) gets a credential token from Google, then sends it to `POST /api/v1/auth/google`. The server verifies it with `google-auth-library`. If valid, a 7-day JWT is issued and returned.

The app stores no passwords. User accounts are created on first sign-in if the Google ID is new.

### Validation

- Title: required, max 200 characters
- Description: optional, max 1000 characters
- dueDate: optional, ISO 8601, must be in the future at time of write
- Completing a future-dated task is also blocked at the service layer (so even if validation is bypassed, the business rule still holds)

### Rate limiting

- Auth routes: 10 requests per 15 minutes per IP
- Todo routes: 100 requests per 15 minutes per IP

### Error handling

The global error handler in `middlewares/errorHandler.ts` catches Mongoose `CastError` (bad ObjectId) and `ValidationError` and maps them to 400s. Everything else becomes a 500. This means controllers do not need individual try/catch for Mongoose-specific errors.

---

## API summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/google | Exchange Google credential for a JWT |
| GET | /api/v1/todos | List todos (paginated, sortable) |
| POST | /api/v1/todos | Create a todo |
| POST | /api/v1/todos/search | Search todos by title or description |
| PUT | /api/v1/todos/:id | Update title, description, dueDate |
| PATCH | /api/v1/todos/:id/done | Toggle done status |
| DELETE | /api/v1/todos/:id | Delete a todo |

Full request/response examples with field tables are in `API_REFERENCE.md`.

---

## Assumptions and Limitations

One user cannot see another user's todos — `userId` is always taken from the verified JWT, never from the request body.

The `dueDate` validation rejects past dates at write time. A todo with a future date stays in the database after that date passes — the user removes it manually.

Tokens expire after 7 days. After expiry the user signs in again through Google.

The app does not send emails or notifications.
