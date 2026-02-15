# Compro – Compare & Save

Compare prices across **food**, **shopping**, and **rides** in one place. Compro helps you find the best deal and save.

## Stack

- **React 19** + **TypeScript** + **Vite 6**
- **Tailwind CSS** – styling
- **React Router** – routing
- **Supabase** – auth & optional backend (orders, edge functions)
- **Lucide React** – icons

## Setup

```bash
npm install
```

### Environment (optional)

Without Supabase env vars, the app runs in **mock mode** (guest auth, mock search results, mock orders). To use real auth and data:

1. Copy `.env.example` to `.env`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your [Supabase](https://supabase.com) project.

## Scripts

| Command   | Description        |
|----------|--------------------|
| `npm run dev`    | Start dev server   |
| `npm run build`  | Production build   |
| `npm run preview`| Preview production build |
| `npm run lint`   | Run ESLint         |

## Project structure

- `src/screens/` – page components (Home, Results, Profile, Inbox, Login, etc.)
- `src/components/` – reusable UI (ResultCard, PlatformCard, Layout, ProtectedRoute)
- `src/context/` – AuthContext, SearchContext
- `src/hooks/` – useComparisonEngine, useOrders
- `src/lib/` – Supabase client

## Features

- **Search & compare** – Food, shopping, rides with mock data; optional Supabase edge function for real product search.
- **Auth** – Email/password via Supabase; mock login when Supabase is not configured.
- **Protected routes** – Inbox, Profile, History require sign-in.
- **Orders** – Inbox shows orders (mock or from Supabase `orders` table with realtime).
- **Profile** – Compro ID, spending insights placeholder, connected apps, sign out.
