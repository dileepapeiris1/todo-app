# TrackLog — Web App

React web app for the TrackLog task manager. Built with Vite, TypeScript, Tailwind CSS, and TanStack Query.

---

## Getting started

Prerequisites: Node.js 20+, a running instance of the backend API.

```bash
# install dependencies
npm install

# copy env and fill in the values
cp .env.example .env

# start the dev server
npm run dev
```

The app runs at `http://localhost:5173` by default.

---

## Environment variables

```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

`VITE_API_URL` — the base URL of the backend. For local dev this is `http://localhost:5000`. For Choreo deployments it will be something like `https://your-backend.choreoapis.dev`.

`VITE_GOOGLE_CLIENT_ID` — same client ID used in the backend. The webapp uses the Google Identity Services SDK to get a credential token which is then sent to the backend for verification.

---

## Available scripts

```bash
npm run dev        # dev server with hot reload
npm run build      # production build (tsc + vite)
npm run preview    # preview the production build locally
npm test           # run Vitest in watch mode
npm run test:run   # single test run (good for CI)
npm run coverage   # test coverage report
```

---

## Project structure

```
src/
├── App.tsx                    routing and provider wiring
├── main.tsx                   React root, wraps App with AuthProvider
├── index.css                  Tailwind import, dark variant, progress bar keyframe
├── vite-env.d.ts              vite/client type reference for SVG imports
│
├── constants/                 all app-wide string and config values
│   ├── api.ts                 PAGE_SIZE, SORT_OPTIONS, QUERY_KEYS
│   ├── auth.ts                sign-in copy and GOOGLE_GSI_SCRIPT_URL
│   ├── config.ts              API_URL, APP_NAME
│   ├── landing.ts             hero copy, press quotes, nav labels
│   ├── routes.ts              ROUTES object { APP, HOME, SIGNIN }
│   ├── storage.ts             localStorage key names (TOKEN_KEY, USER_KEY, THEME_KEY)
│   └── validation.ts          TITLE_MAX_LENGTH, DESC_MAX_LENGTH (mirrors backend)
│
├── types/                     TypeScript types and enums
│   ├── common.ts              ID, ISODateString, Nullable<T>, ErrorInfo
│   ├── todo.ts                Todo interface
│   ├── sorting.ts             SortField enum, SortOrder enum
│   ├── views.ts               View enum (Today | All | Completed)
│   ├── pagination.ts          Paginated<T>, PaginationParams
│   ├── requests.ts            CreateTodoRequest, UpdateTodoRequest, SearchTodosRequest
│   └── snack.ts               SnackType enum, Snack interface
│
├── utils/                     pure functions, no React
│   ├── date.ts                isToday, fmtTime, fmtDateLabel, toDateTimeLocal, nowDateTimeLocal
│   ├── error.ts               getErrorStatus, toErrorInfo
│   └── group.ts               groupByDate — groups todos into dated sections
│
├── services/
│   └── api.ts                 typed HTTP client with ApiError class
│
├── contexts/
│   └── AuthContext.tsx        token and user state, signIn, signOut
│
├── providers/
│   ├── LoggerProvider.tsx     debug/info/warn/error, silent in production
│   ├── QueryProvider.tsx      TanStack QueryClient setup
│   ├── SnackbarProvider.tsx   global toast notifications
│   └── ThemeProvider.tsx      light/dark mode, persists to localStorage
│
├── hooks/
│   ├── useTodos.ts            useInfiniteTodos (TanStack infinite query), fetchSearchPage
│   └── useTodoMutations.ts    useAddTodo, useUpdateTodo, useToggleTodo, useDeleteTodo
│
├── assets/
│   ├── empty-results/         EmptyIcon and SearchNoResultsIcon SVG components
│   ├── error/                 error-401/403/404/500 SVGs and TSX wrappers
│   ├── hero-image/            dashboard screenshot for the landing page
│   └── logo/                  app logo icon
│
├── components/
│   ├── common/
│   │   ├── AppLayout.tsx      app shell — navbar, sidebar, content area, footer
│   │   ├── header/Header.tsx  landing page sticky header
│   │   └── footer/Footer.tsx  landing page footer
│   ├── dashboard/             all the UI pieces inside the app
│   │   ├── AppSidebar.tsx     sidebar nav (desktop collapsed, mobile bottom sheet)
│   │   ├── TaskRow.tsx        single todo row
│   │   ├── AddForm.tsx        inline create form
│   │   ├── EditForm.tsx       inline edit form
│   │   ├── DateSection.tsx    date group header + rows
│   │   ├── SortControls.tsx   sort field select + direction toggle
│   │   ├── Skeleton.tsx       loading placeholder rows
│   │   ├── EmptyTodos.tsx     empty state for list views
│   │   ├── EmptySearch.tsx    empty state for search
│   │   └── ErrorState.tsx     error illustration by HTTP status code
│   ├── landing/
│   │   ├── Hero.tsx           hero section with dashboard screenshot
│   │   └── PressQuotes.tsx    testimonials — auto-play carousel on mobile, grid on desktop
│   └── auth/
│       └── SignInCard.tsx      centred card wrapper for the sign-in page
│
├── pages/
│   ├── TodoPage.tsx           main app page — thin orchestrator, no UI logic
│   ├── LandingPage.tsx        public landing page
│   └── SignInPage.tsx         Google OAuth sign-in
│
└── __tests__/                 all test files
    ├── setup.ts               jest-dom setup and matchMedia stub
    ├── helpers.tsx             renderWithProviders, makeTodo factory
    ├── utils/                 date, error, group utility tests
    ├── providers/             ThemeProvider, SnackbarProvider, LoggerProvider tests
    └── components/
        ├── dashboard/         TaskRow, AddForm, EditForm, SortControls, Skeleton, empty states
        └── landing/           Hero, Footer, Header, PressQuotes tests
```

---

## Architecture

### React 19 with the compiler

The project uses React 19 with the experimental React Compiler (`babel-plugin-react-compiler`). The compiler handles memoisation automatically — it analyses component render functions and inserts the equivalent of `useMemo` and `useCallback` where they are actually needed. This means you will not see many manual `useMemo`/`useCallback` calls in the components, but some are still used explicitly where the dependency on external state makes it important to be precise.

### TanStack Query (React Query v5)

Data fetching is handled entirely by TanStack Query. A few things worth noting about how it is set up:

**Infinite scroll** — the main todo list uses `useInfiniteQuery` instead of a plain `useQuery`. When the user scrolls near the bottom, an `IntersectionObserver` fires `fetchNextPage()`. TanStack Query accumulates all pages automatically so you just flatten `data.pages` to get the full list.

**Cache invalidation** — all mutation hooks (add, update, toggle, delete) call `invalidateQueries({ queryKey: ['todos'] })` on success. Because the infinite query key starts with `'todos'`, it gets picked up by the fuzzy match and all loaded pages are refetched. This means after any write, the list always reflects the latest data from the server.

**Search** — the search does not use TanStack Query because search results need to be accumulated manually for infinite scroll. Instead there is a debounced `useEffect` that calls `fetchSearchPage()` directly and appends results into local state.

### Vite

Vite handles the dev server and production build. The build command is `tsc -b && vite build` — TypeScript is checked first, then Vite bundles. Vite's default output is `dist/`. No custom output directory is configured.

### Tailwind CSS v4

The project uses Tailwind v4 with the `@tailwindcss/vite` plugin. Dark mode is configured with the `class` strategy — the `dark` class is toggled on `<html>` by the ThemeProvider. The `@variant dark` directive in `index.css` tells Tailwind v4 how to apply dark: utilities.

Custom colours are defined in `tailwind.config.js` — primarily the `primary` (red), `quaternary` (slate greys), and semantic colours like `success`, `info`, and `warning`.

### Vitest

Tests run with Vitest in jsdom environment. The setup file (`src/__tests__/setup.ts`) does two things: imports `@testing-library/jest-dom` for DOM matchers, and stubs `window.matchMedia` because jsdom does not implement it.

Test files live in `src/__tests__/` mirroring the source folder structure. The `helpers.tsx` file provides `renderWithProviders()` which wraps components with the necessary React contexts for testing (router, query client, theme), and `makeTodo()` which builds minimal test fixtures.

### Providers

All global state flows through React context providers stacked in `App.tsx`:

- **ThemeProvider** — reads localStorage for the stored preference, falls back to `prefers-color-scheme`. Writes `dark` or `light` to localStorage on toggle.
- **SnackbarProvider** — the `showSnack(message, type)` function is accessed via `useSnackbar()` inside mutation hooks. Snacks auto-dismiss after 4 seconds.
- **QueryProvider** — sets up the TanStack QueryClient with `retry: 1`, `staleTime: 30s`, and `refetchOnWindowFocus: false`.
- **LoggerProvider** — wraps `console.info/warn/error/debug`. The `debug` method is silenced in production.

### Pages are thin

`TodoPage.tsx` does not contain any JSX that renders UI elements directly. It holds state, calls hooks, and passes data and callbacks down to components. The components in `src/components/dashboard/` contain all the actual markup and styling. The idea is that if you need to change how a task row looks, you only touch `TaskRow.tsx`, not the page.

### Dark mode

Every component in the dashboard and landing folders has `dark:` variants on background, text, and border colours. The theme is controlled by adding or removing the `dark` class on `<html>`. The toggle button lives in the app navbar (for authenticated users) and the landing page header (for public pages).

### Mobile layout

On small screens the sidebar becomes a bottom sheet that slides up. The hamburger button in the navbar toggles it. The sheet supports swipe-down to dismiss (implemented with touch events). The sidebar content switches to a full-width layout with larger tap targets when in sheet mode (`isMobileSheet` prop on `AppSidebar`).

---

## Assumptions and Limitations

Authentication is Google-only. There is no email/password or anonymous login path.

Session tokens expire after 7 days. When one expires the user is redirected to the sign-in page on the next request.

The `datetime-local` input does not carry timezone information. Due times are treated as local browser time.
