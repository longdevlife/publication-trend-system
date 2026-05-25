# Backend — Publication Trend System

Node.js + Express 5 + TypeScript + MongoDB + BullMQ.

## Quick start

```bash
# from repo root
pnpm install
cp apps/backend/.env.example apps/backend/.env
# fill in GEMINI_API_KEY and rotate the JWT secrets
pnpm docker:up                # starts Mongo + Redis locally
pnpm dev:backend              # http://localhost:4000
```

Health check: `GET http://localhost:4000/health`.

## Module layout

```
src/
├── server.ts            entry — wires connections then starts app
├── app.ts               Express composition (middleware order matters)
├── config/env.ts        Zod-validated process.env
├── lib/                 cross-cutting: logger, db, redis, cache, error
├── middleware/          auth (JWT), validate (Zod), error-handler
├── modules/
│   ├── auth/            register / login / refresh / logout / me
│   ├── papers/          paper CRUD + keyword search
│   ├── embeddings/      provider interface + Gemini implementation
│   └── llm/             Gemini text / JSON wrapper
├── queue/queue.ts       BullMQ queues — api-sync, embedding, report
├── workers/             standalone worker entry points (separate processes)
└── routes/index.ts      mounts module routers under /api/v1
```

## Conventions

- Every response uses the envelope `{ success: true, data, meta? }` or `{ success: false, error }`.
- Controllers stay thin — business logic lives in `*.service.ts`.
- Throw `AppError.*` from services for structured HTTP errors; the global handler formats them.
- Use `validate(schema, "body" | "query" | "params")` rather than inline Zod parsing.
- Long-running work (API sync, embedding, report generation) MUST go through a queue, never run inside a request handler.

## Env vars

See [.env.example](.env.example) — `env.ts` will refuse to boot if anything required is missing.
