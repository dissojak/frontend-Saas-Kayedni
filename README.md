# Kayedni Frontend

A Next.js frontend for the Bookify SaaS platform. It provides booking flows, business management pages, staff workflows, profile pages, search, and client-facing discovery.

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS v4
- React Query
- Radix UI

## Key Features

- Authentication and account flows (login, signup, password reset)
- Business dashboard and management views
- Staff-oriented service pages and actions
- Booking and profile pages
- Search experience and category browsing
- Tracking integration (session + event tracking)
- Optional Google Analytics forwarding for important events

## Prerequisites

- Node.js 18+ (Node.js 20 recommended)
- npm 9+

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a local env file in this folder:

```bash
cp .env.local.example .env.local
```

If `.env.local.example` does not exist, create `.env.local` manually.

3. Add environment variables (example values shown below):

```env
NEXT_PUBLIC_API_URL=http://localhost:8088/api/v1
NEXT_PUBLIC_API_BASE_URL=http://localhost:8088/api
NEXT_PUBLIC_AUTH_URL=http://localhost:8088/api/v1/auth
NEXT_PUBLIC_TRACKING_SERVICE_URL=http://localhost:5000
NEXT_PUBLIC_TRACKING_API_KEY=your-tracking-api-key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

4. Start the dev server:

```bash
npm run start
```

App runs at `http://localhost:3000` by default.

## Environment Variables

- `NEXT_PUBLIC_API_URL`: Base URL used by most app API calls.
- `NEXT_PUBLIC_API_BASE_URL`: Base URL used by shared API client helpers.
- `NEXT_PUBLIC_AUTH_URL`: Auth-specific backend base URL.
- `NEXT_PUBLIC_TRACKING_SERVICE_URL`: Tracking service host (Express tracking backend).
- `NEXT_PUBLIC_TRACKING_API_KEY`: API key sent in `x-api-key` to tracking service.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: Optional GA4 property ID.

## Scripts

- `npm run start`: Run Next.js in development mode.
- `npm run build`: Create a production build.
- `npm run lint`: Run ESLint checks.

## Integration Notes

- Main backend expected on `http://localhost:8088` with `/api` context path.
- Tracking backend expected on `http://localhost:5000`.
- Frontend tracking provider sends session/event data and supports `sendBeacon` for unload-safe delivery.

## Project Structure (High Level)

- `src/app`: App router pages and layouts.
- `src/app/(pages)`: Main feature route groups (auth, booking, business, client, staff, admin).
- `src/global/providers`: Shared providers such as tracking.
- `src/global/lib`: API and utility wrappers.
- `src/components`: Reusable UI components.

## Troubleshooting

- Backend not configured error:
  - Ensure `NEXT_PUBLIC_API_BASE_URL` is set.
- Requests failing with CORS:
  - Confirm backend `CORS_ORIGIN` includes `http://localhost:3000`.
- Tracking events rejected:
  - Verify `NEXT_PUBLIC_TRACKING_API_KEY` matches tracking backend `API_KEY`.
- Empty analytics in GA4:
  - Confirm `NEXT_PUBLIC_GA_MEASUREMENT_ID` is valid and enabled in GA.

## License and Copyright

This repository is proprietary.

Copyright (c) 2026 StoonProduction. All rights reserved.

No right is granted to use, copy, edit, modify, distribute, or create derivative works without prior written permission from StoonProduction.

See `LICENSE` in this repository and `../LICENSE` at workspace root for full terms.
