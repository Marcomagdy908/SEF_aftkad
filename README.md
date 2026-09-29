# 🤝 SEF Aftkad — Service & Attendance Dashboard

**React · TypeScript · Firebase · SheetJS**

A church service administration dashboard for managing members, events, and attendance in a shared Firebase database.

## ✨ Feature reel

- Email/password sign-in with Firebase Authentication.
- Member profiles, editing, search, and filters.
- Event management and attendance tracking.
- Realtime Database subscriptions.
- Spreadsheet imports with a preview before saving.

## 🚀 Getting started

Use Node.js 22.12 or later and npm.

```bash
git clone https://github.com/Marcomagdy908/SEF_aftkad.git
cd SEF_aftkad/client
npm install
npm run dev
```

Open the local URL printed by Vite. To create and inspect a production build:

```bash
npm run build
npm run preview
```

## ⚙️ Firebase setup

The application lives in `client/`. Copy `client/.env.example` to `client/.env.local` and supply your Firebase project values.

For a database with a custom or regional URL, also set:

```env
VITE_FIREBASE_DATABASE_URL=https://your_database_url
```

Enable email/password Authentication and Realtime Database, create an authorized account, and configure database access rules for your deployment. The app uses the `users`, `events`, and `attendance` database paths.

Restart Vite after updating environment variables.

## 🗂️ Project map

| Path | Purpose |
| --- | --- |
| `client/src/App.tsx` | Application state, data subscriptions, and actions |
| `client/src/components/` | Dashboard, members, events, attendance, login, and modals |
| `client/src/firebase.ts` | Firebase initialization |
| `client/src/types.ts` | Shared TypeScript types |
| `client/public/` | Icons, manifest, and service worker |

## 🧪 Checks

Run from `client/`:

```bash
npm run lint
npm run build
```


---

[Marco Magdy](https://github.com/Marcomagdy908) · [More projects](https://github.com/Marcomagdy908?tab=repositories)
