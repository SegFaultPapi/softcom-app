# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from `softcom-app/`:

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint check
npm start        # Run production server
```

> The project uses pnpm (`pnpm-lock.yaml` present), so `pnpm` can substitute `npm` for faster installs.

`next.config.mjs` intentionally ignores TypeScript build errors (`ignoreBuildErrors: true`) — this is current project state, not something to fix unless asked.

## Architecture

**SoftCom** is a bond valuation and portfolio management platform built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and shadcn/ui. The UI is in Spanish.

### App structure

```
softcom-app/
├── app/                  # Next.js App Router pages
├── components/
│   ├── ui/               # shadcn/ui primitives (do not edit manually)
│   └── *.tsx             # App-level components
├── lib/
│   ├── auth-context.tsx  # AuthProvider + mock users
│   └── utils.ts          # cn() utility
└── hooks/                # use-mobile, use-toast
```

### Auth & RBAC

- `lib/auth-context.tsx` exposes `AuthProvider` and `useAuth()`. Auth state lives in `sessionStorage` (mock only — no backend yet).
- Three roles: `admin`, `empleado`, `cliente`. Login with: `admin@softcom.com/admin`, `empleado@softcom.com/empleado`, `cliente@softcom.com/cliente`.
- `components/route-guard.tsx` wraps protected pages; redirects unauthenticated users to `/login` and shows an error if the role is not in `allowedRoles`.
- `app/layout.tsx` is the root layout: it wraps everything with `AuthProvider` and renders `NavBar`. The home route (`/`) redirects authenticated users to `/dashboard` and others to `/login`.

### Pages

| Route | Purpose | Allowed roles |
|---|---|---|
| `/login` | Public login | — |
| `/dashboard` | Role-filtered shortcut cards | all |
| `/valuacion` | CETES & Bonos M calculator | empleado, cliente |
| `/portafolio` | Holdings table (empleado can filter by client) | empleado, cliente |
| `/operaciones` | Buy/sell bond form | empleado, cliente |
| `/admin/usuarios` | User CRUD | admin |

### UI conventions

- All shadcn/ui components live in `components/ui/`. Add new ones via `npx shadcn@latest add <component>` rather than editing manually.
- `react-hook-form` + `zod` are installed but **not yet wired up** in pages — current forms use plain `useState`. Integrate them when adding real validation.
- Page layout pattern: `<RouteGuard>` → `<PageHeader>` (title + breadcrumbs + action buttons) → content cards/tables.
- Form field pattern: `FieldGroup` → `Field` + `FieldLabel` + `Input` / `InputGroup` (for unit suffixes like MXN, %).
- Path alias `@/*` resolves to the repo root (`softcom-app/`).
- Theming: CSS custom properties with oklch color space in `app/globals.css`; dark mode via `.dark` class (`next-themes`).

### Current state

The UI is feature-complete with mock data. No backend, database, or real auth. Bond valuation calculations and transaction submission are placeholder TODOs (marked with `// TODO` comments in the page files).
