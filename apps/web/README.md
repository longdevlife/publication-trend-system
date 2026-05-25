# Web — Publication Trend System

React + Vite + TypeScript + Tailwind + shadcn/ui.

## Quick start

```bash
# from repo root
pnpm install
cp apps/web/.env.example apps/web/.env
pnpm dev:web                   # http://localhost:5173
```

The dev server proxies `/api` → `http://localhost:4000` so you don't need CORS in dev.

## Add a shadcn component

This project is shadcn-ready ([components.json](components.json) configured).

```bash
cd apps/web
pnpm dlx shadcn@latest add button card input form dialog
```

Components land under `src/components/ui/`.

## Layout

```
src/
├── main.tsx          providers: QueryClient + Router
├── App.tsx           route table
├── index.css         Tailwind layers + shadcn CSS vars
├── lib/
│   ├── api-client.ts axios + JWT refresh-on-401
│   ├── auth-store.ts zustand persisted auth state
│   ├── query-client.ts react-query defaults
│   └── utils.ts      shadcn `cn` helper
├── pages/            route components (one per route)
├── components/ui/    shadcn primitives (generated)
└── components/       app-specific composed components
```

Shared TypeScript types come from `@trend/shared-types` (workspace package).
