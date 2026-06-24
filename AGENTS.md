# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

## Project Overview

**SIMDP LAZWaf Al Azhar** — Employee Data Management System for LAZWaf Al Azhar (an Islamic charitable organization). The system has two layers:

- **Backend**: Google Apps Script (GAS) REST API in `Code.gs` — deployed as a Web App on Google's infrastructure. Google Sheets serves as the database (15 sheets).
- **Frontend**: Astro 6 app in `simdp-frontend/` — deployed to Vercel. Uses React Islands for interactive components, Tailwind CSS 4 for styling, and Nano Stores for client-side state.

The frontend currently uses a **mock API layer** (`src/lib/api.ts`) that persists data in `localStorage`. The `gasClient` bridge in the same file attempts real GAS calls first and falls back to mock data when `VITE_GAS_API_URL` is empty or the GAS call fails.

## Commands

All frontend commands run from `simdp-frontend/`:

| Command | Action |
|---------|--------|
| `npm install` | Install dependencies (requires Node >= 22.12.0) |
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview production build locally |

There are no tests, linters, or type-check scripts configured. Run `npx astro check` for Astro-specific type checking.

**PowerShell note**: This project is developed on Windows PowerShell, which does not support `&&`. Use `;` to chain commands.

## Architecture

### Two-Tier System

```
Browser  ──(fetch)──>  Astro Frontend (Vercel)
                         │
                         ├── Public pages (/ , /rekrutmen) → Astro SSG, no auth
                         └── Internal pages (/dashboard, /pegawai, etc.) → client-side auth gate
                         │
                         └──(REST)──> Google Apps Script API (Code.gs)
                                        │
                                        └── Google Sheets (15 sheets = 15 tables)
```

### Frontend (`simdp-frontend/`)

**Three layouts** control page structure:
- `PublicLayout.astro` — Landing page and recruitment (no auth, no sidebar)
- `AuthLayout.astro` — Login page
- `AppLayout.astro` — Internal app shell (sidebar + header + content slot). Contains an inline script that auto-creates a demo Super Admin session in `localStorage` if none exists, enabling development without real authentication.

**React Islands** are used for all interactive components. Components are organized by domain under `src/components/`: `landing/`, `rekrutmen/`, `pegawai/`, `dashboard/`, `akun/`, `auth/`, `settings/`, `shared/`.

**State management**: `src/lib/store.ts` uses Nano Stores (`atom`) for the user session. Session is persisted in `localStorage` under key `simdp_session`.

**API layer** (`src/lib/api.ts`):
- Exports a `mockDB` class (localStorage-backed) with seed data for employees, volunteers, settings, users, and audit logs.
- Exports an `api` object with methods matching GAS endpoints (e.g., `api.getEmployeesList()`, `api.saveEmployee()`).
- Has a `gasClient` that attempts real GAS fetch; when `VITE_GAS_API_URL` is unset or the call fails, methods fall back to mock data.
- Client-side caching with TTL via `clientCache` (stored in `localStorage` with `simdp_cache_` prefix).
- All TypeScript interfaces (`Employee`, `Volunteer`, `UserAccount`, `AuditLog`, `CareerEntry`, etc.) are defined here.

**Styling**: Tailwind CSS 4 via `@tailwindcss/vite` plugin. Custom animations and utility classes in `src/styles/global.css`. Fonts: Inter (body) and Plus Jakarta Sans (headings) from Google Fonts.

**Routing**: Astro file-based routing in `src/pages/`. Key routes:
- `/` — Public landing page
- `/rekrutmen` — Public volunteer registration form
- `/login` — Google login
- `/dashboard` — Internal dashboard
- `/pegawai` — Employee CRUD (list, detail, add, edit)
- `/rekrutmen-admin` — Admin recruitment panel
- `/akun` — User account management
- `/settings` — App settings

### Backend (`Code.gs`)

Single-file Google Apps Script backend (~1500 lines). Key patterns:

**Router**: `doGet(e)` and `doPost(e)` both route through `handleApiRequest(action, params, body)` which uses a switch/case on the `action` string.

**Public endpoints** (no auth): `landing.stats`, `rekrutmen.status`

**Auth**: Username/password login with SHA-256 hashed passwords stored in the `users` sheet. Session tokens are cached via `CacheService`. Google OAuth login (`loginWithGoogle`) uses `Session.getActiveUser().getEmail()`. Sessions expire after a configurable duration (default 8 hours).

**Caching**: Three-tier caching using GAS `CacheService`:
- Landing stats: 10 min TTL
- Pegawai data: 3 min TTL (per user-role)
- Dashboard data: 2 min TTL (per user-role)
- A global dirty flag (`simdp_cache_dirty`) invalidates all cached data on writes.

**Concurrency**: Uses `LockService.getScriptLock()` for write operations on pegawai data.

**Database setup**: `setupDatabase()` function initializes all 15 sheets with headers and seed data. Must be run once after deploying the GAS project.

**Role-based access**: Four roles — Super Admin, Admin HR, Manager Divisi (filtered to own department), Staf Viewer. Sensitive fields (NIK, phone, address) are masked for non-admin roles.

### CORS Pattern

GAS Web App requires `Content-Type: text/plain` (not `application/json`) for POST requests from external origins. The frontend `gasClient.post()` sends via `fetch` with `JSON.stringify` in the body without setting Content-Type headers, which works with GAS CORS.

## Environment Variables

Defined in `simdp-frontend/.env`:

| Variable | Purpose |
|----------|---------|
| `VITE_GAS_API_URL` | GAS Web App deployment URL. When empty, frontend uses mock data. |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID (currently empty — login uses mock). |

## Key Conventions

- **Language**: The PRD, UI labels, variable names, and comments use Indonesian (Bahasa Indonesia). Maintain this convention.
- **Employee ID format**: `YYYYMMDDXXX` (join date + sequential number).
- **Recruitment ticket format**: `REK-YYYY-XXXX` (year + sequential, resets yearly).
- **Employment statuses**: `Tetap` (permanent), `Kontrak` (contract), `Relawan` (volunteer — paid but no benefits/allowances).
- **Department spelling**: The codebase uses `departement` (not `department`) — preserve this spelling for consistency.
- **Response format**: GAS always returns `{ success: boolean, data?: any, error?: string, message?: string }` via `ContentService` with JSON MIME type.
- **Audit logging**: All mutations are logged to the `audit_log` sheet via `logAction()`.

## PRD Reference

The full product requirements document is at `PRD.md` (Indonesian). It covers:
- Organization structure (5 divisions, 12 units)
- Complete API specification for all endpoints
- Database schema for all 15 Google Sheets
- Role/permission matrix
- Feature specifications for landing page, recruitment, dashboard, employee CRUD, career history, notifications, and more
