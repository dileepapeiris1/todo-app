# TrackLog — Mobile App

React Native mobile app for the TrackLog task manager. Built with Expo, TypeScript, TanStack Query, and Lucide React Icons.

---

## Getting started

### Prerequisites

1. **Node.js**: Version 18 or 20+
2. **Expo Go**: Download the Expo Go app on your [iOS App Store](https://apps.apple.com/us/app/expo-go/id984023395) or [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) to run the app on a physical device.
3. **Backend API**: A running instance of the TrackLog backend API.

### Local Development Setup

1. **Install dependencies** (from the workspace root):
   ```bash
   pnpm install
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and fill in the values:
   ```bash
   cp .env.example .env
   ```

3. **Start the development server**:
   You can start it from the workspace root:
   ```bash
   pnpm dev:mobile
   ```
   Or from the `mobileapp/` directory:
   ```bash
   pnpm start
   ```

4. **Scan the QR Code**:
   - For **Android**: Open the Expo Go app and select "Scan QR Code", then scan the QR code printed in the terminal.
   - For **iOS**: Open the default Camera app and scan the QR code. Tap the notification banner to open in Expo Go.
   - Alternatively, press `a` in the terminal to run on an Android emulator or `i` to run on an iOS simulator.

---

## Environment variables

```ini
EXPO_PUBLIC_API_URL=http://localhost:5000
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_web_client_id
```

- **`EXPO_PUBLIC_API_URL`**: The base URL of the backend API. When running on a physical device, `localhost` will not work. Replace it with your machine's local IP address (e.g. `http://192.168.1.100:5000`) or the production API endpoint.
- **`EXPO_PUBLIC_GOOGLE_CLIENT_ID`**: The Google OAuth 2.0 Web Client ID registered in your Google Cloud Console.

---

## Project structure

```
mobileapp/
├── app/                      Expo Router pages (file-based routing)
│   ├── +native-intent.tsx    Deep linking configuration
│   ├── _layout.tsx           Root layout, context providers wrapper
│   ├── index.tsx             Splash/entry redirect screen
│   ├── sign-in.tsx           Google Sign-In screen
│   └── todo.tsx              Main authenticated tasks list screen
│
├── src/                      Application source code
│   ├── components/           Shared UI elements (Layout, Task cards, filters)
│   ├── constants/            App-wide colors, themes, API config, limits
│   ├── contexts/             AuthContext (handles secure token storage)
│   ├── hooks/                Queries & Mutations (useTodos, useTodoMutations)
│   ├── providers/            QueryProvider, SnackbarProvider, etc.
│   ├── services/             REST API client using fetch
│   ├── types/                TypeScript interfaces and definitions
│   └── utils/                Date formatting, helpers, and groupers
```

---

## Key Features & Architecture

### File-Based Routing (Expo Router)
The application leverages **Expo Router v4** for clean, file-based routing. The `app/index.tsx` acts as the gateway screen that checks the auth token status and routes the user dynamically:
- Unauthenticated users are sent to the `app/sign-in.tsx` flow.
- Authenticated users are sent to the main dashboard in `app/todo.tsx`.

### Secure Storage (Expo SecureStore)
Unlike web storage (`localStorage`), authentication JWT tokens on mobile are stored securely using `expo-secure-store`. This ensures the JWT is encrypted and protected at the operating system level.

### Google OAuth Flow on Mobile
Authentication utilizes Google OAuth via Expo Auth Session. Once Google returns the authorization response, the token is sent to the backend endpoint `/api/v1/auth/google` to receive the app's JWT, which is then persisted to SecureStore.

### Data Syncing & Mutations
State management and server-caching are powered by **TanStack Query (React Query)**. All operations (creating, updating, deleting, or toggling tasks) trigger query invalidation, automatically syncing the mobile interface with the backend database.

---

## Assumptions and Limitations

Authentication is Google-only. There is no email/password or anonymous login path.

Session tokens expire after 7 days. When a session expires, the user is automatically redirected to the Google Sign-in screen.

The `EXPO_PUBLIC_API_URL` environment variable must be configured to the host machine's local IP address when running on physical devices via Expo Go, as `localhost` will not resolve from physical devices.

The app requires active internet connectivity for operations. Offline caching is temporary and in-memory, and changes made offline are not persisted locally.
