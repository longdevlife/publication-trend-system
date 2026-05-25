# Phase A — Team Task Assignment

**Phase A goal:** end-of-phase the system has ~100 real OpenAlex papers in MongoDB *and* a working web auth flow (login/register/dashboard) — both on the same backend.

**Status as of 2026-05-25:**
- ✅ Track B (Frontend auth UI) — DONE, committed `9e1002c`
- ⏳ Track A (Backend sync pipeline) — Lead coding
- 🆕 Tracks C, D, E — parallel work for the rest of the team

Each track below is **fully independent** — no merge conflicts with Track A, no dependency on Track A data. You can all push to feature branches and PR into `dev` in any order.

---

## Coordination Ground Rules

1. **Branch per task:** `feat/<your-name>/<short-description>` off `dev`.
2. **PR review:** at least one other team member approves before merge.
3. **Commit message format:** `feat(scope): summary` / `fix(scope): summary` / `docs: summary`. Run conventional commit style.
4. **Daily standup (15 min):** 9am Discord voice. Each person: yesterday / today / blockers.
5. **No commits to `main`.** Lead merges `dev` → `main` at end of Phase A.
6. **Pull `dev` before starting work each morning.** Avoid stale branches.
7. **Keep your own `.env` private.** Do not commit, do not paste in any chat.

---

## Track A — Backend Sync Pipeline 👑 LEAD (hoangtira)

**Status:** in progress.
**Tracking:** tasks #27–#31 in the project task list.
**Files:** `apps/backend/src/modules/api-sync/*`, `apps/backend/src/modules/papers/models/*`, `apps/backend/src/modules/audit/*`, `apps/backend/src/workers/sync.worker.ts`, `apps/backend/scripts/seed-providers.ts`.
**Effort:** 6–10 hours.

Detailed spec lives in [`docs/superpowers/specs/2026-05-25-phase-a-design.md`](superpowers/specs/2026-05-25-phase-a-design.md).

Brief: 10 new Mongoose models, OpenAlex API client with rate-limit + retry, normalizer (OpenAlex JSON → Paper schema with `abstract_inverted_index` reconstruction), sync service with dedup + upsert merge + inline quality check, BullMQ worker, admin endpoint `POST /api/v1/admin/sync`, cron `0 2 * * *`, seed script for `api_providers`.

**Acceptance:** `pnpm worker:sync` consumes admin-triggered job, syncs ~100 papers about "large language model education" (year ≥ 2022), `paper_source_records` populated for each, re-running the sync increments `totalDuplicates` not `totalInserted`.

---

## Track C — Mobile Auth Screens 📱 DEV 1

**Goal:** mirror the web auth flow on Expo. Same hooks, same backend, mobile UI.

**Files to create:**
```
apps/mobile/src/features/auth/components/
├── login-form.tsx                NEW — react-hook-form + zodResolver, native inputs
└── register-form.tsx             NEW

apps/mobile/app/(auth)/
├── _layout.tsx                   NEW — Stack with title "Sign in" / "Sign up"
├── login.tsx                     NEW — wraps <LoginForm/>
└── register.tsx                  NEW — wraps <RegisterForm/>

apps/mobile/src/components/
└── protected-route.tsx           NEW — Expo Router useRouter().replace("/(auth)/login")
                                  on missing token

apps/mobile/src/features/auth/index.ts   EXTEND — export LoginForm, RegisterForm
apps/mobile/src/features/auth/schemas/auth.schemas.ts   COPY from web
apps/mobile/app/_layout.tsx       EDIT — wrap protected screens, add logout button
```

**Reuse, don't rewrite:**
- `apps/mobile/src/features/auth/index.ts` already exports `useLogin`, `useRegister`, `useLogout`, `useCurrentUser` — these work as-is.
- `apps/mobile/src/services/api-client.ts` already has axios + JWT refresh.
- `apps/mobile/src/stores/auth-store.ts` already persists tokens to `expo-secure-store` (Keychain on iOS, Keystore on Android).
- The web copy in `apps/web/src/features/auth/components/login-form.tsx` is the reference. Replace shadcn primitives with React Native components or NativeWind-styled `<View>` / `<TextInput>` / `<Pressable>`.

**Toast/notification:** use `react-native` `Alert.alert()` for errors initially, or wire `react-native-toast-message` if you want fancier UX (not required for Phase A).

**Validation:** copy `loginSchema` and `registerSchema` from `apps/web/src/features/auth/schemas/auth.schemas.ts` verbatim — these are framework-agnostic Zod schemas.

**Acceptance:**
- Open Expo Go on phone or simulator, scan QR from `pnpm dev:mobile`.
- Register a new account, see success state.
- Force-close app, reopen — still logged in (tokens persisted to secure store).
- Tap profile / logout — redirected to login screen.
- Try to access a protected screen without auth — redirected to login.

**Effort:** 4–6 hours.
**Out of scope (Phase C-mobile):** tab navigation, paper detail screen, search bar, push notifications.

---

## Track D — Frontend Polish + Foundation Components 🎨 DEV 2

**Goal:** ship reusable building blocks the rest of the project will use, and tighten the existing Track B flow.

**Files to create:**
```
apps/web/src/components/
├── empty-state.tsx               NEW — title + description + optional CTA
├── loading-spinner.tsx           NEW — small inline spinner using lucide-react Loader2
├── skeleton.tsx                  NEW (or run: pnpm dlx shadcn@latest add skeleton)
├── page-error.tsx                NEW — generic <ErrorBoundary/> + 500 page
└── paper-card.tsx                NEW — accepts Paper from @trend/shared-types,
                                  shows title/authors/year/journal/citationCount
                                  (renders mock-data fine — Track A will fill DB)

apps/web/src/pages/
├── not-found.tsx                 NEW — 404 page, link back to /
└── error.tsx                     NEW — generic crash page

apps/web/src/components/
└── theme-toggle.tsx              NEW — dark/light toggle using next-themes (already installed)

apps/web/src/main.tsx             EDIT — wrap <App/> with <ThemeProvider/> from next-themes
apps/web/src/routes/app-routes.tsx EDIT — add catch-all <Route path="*" element={<NotFoundPage/>}/>
```

**Reuse, don't rewrite:**
- shadcn components already installed in `apps/web/src/components/ui/`: button, card, dialog, dropdown-menu, form, input, label, sonner. Use them.
- Tailwind CSS variables already wired in `apps/web/src/theme/globals.css` — both light and dark themes are defined.
- `apps/web/src/utils/cn.ts` for className composition.
- `lucide-react` for icons (already in package.json).
- `@trend/shared-types` for the `Paper` type — import it.

**PaperCard sample API:**
```tsx
<PaperCard
  paper={paper}
  onClick={() => navigate(`/papers/${paper.id}`)}
  showCitations
/>
```

You can build PaperCard against a mock paper from a fixtures file — no need to wait for real data from Track A.

**Acceptance:**
- `pnpm dev:web` → navigate to `/totally-fake-url` → 404 page renders.
- Click theme toggle in header → page flips dark/light, persists across reloads.
- `<PaperCard/>` rendered in isolation looks like a real paper card (titled, authors visible, year + citation count).
- Throw an error inside a route on purpose → ErrorBoundary catches, renders Page Error instead of white screen.
- Lighthouse audit: page-error.tsx not regressing accessibility (alt text, contrast).

**Effort:** 4–6 hours.

---

## Track E — DevOps + Tooling 🔧 DEV 3

**Goal:** stop bugs from landing on `main`. Make the team's daily loop tighter.

**Files to create:**
```
.eslintrc.cjs                     NEW — root config extending @typescript-eslint
                                  + react + react-hooks + import + jsx-a11y
.prettierrc.json                  NEW — printWidth 100, semicolons, single quotes
.prettierignore                   NEW — exclude pnpm-lock.yaml, dist, .turbo, build

apps/backend/.eslintrc.cjs        NEW — extends root + node-specific rules
apps/web/.eslintrc.cjs            NEW — extends root + react rules
apps/mobile/.eslintrc.cjs         NEW — extends root + react-native rules

.husky/
├── pre-commit                    NEW — runs `pnpm lint-staged`
└── commit-msg                    NEW — runs `pnpm commitlint --edit "$1"`

.lintstagedrc.json                NEW — *.{ts,tsx} → eslint + prettier
                                       *.{json,md} → prettier

commitlint.config.cjs             NEW — extends @commitlint/config-conventional

.github/workflows/
└── ci.yml                        NEW — on PR + push to dev/main:
                                  pnpm install, lint, typecheck, build matrix

.github/pull_request_template.md  NEW — checklist (typecheck, lint, screenshots)

.vscode/
├── settings.json                 NEW — formatOnSave, eslint.validate, etc.
└── extensions.json               NEW — recommend dbaeumer.vscode-eslint,
                                       esbenp.prettier-vscode, bradlc.vscode-tailwindcss

apps/backend/Dockerfile           NEW — multi-stage, node:22-alpine, pnpm prune
                                  (production-ready for Railway/Render deploy later)
apps/backend/.dockerignore        NEW — node_modules, .env, .turbo, dist

CONTRIBUTING.md                   NEW — branch naming, commit format, PR review
                                  rules, env setup pointer
```

**Run after install:**
```bash
pnpm add -D -w eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser \
  eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-import \
  eslint-plugin-jsx-a11y prettier eslint-config-prettier husky lint-staged \
  @commitlint/cli @commitlint/config-conventional
pnpm exec husky init
```

Then add `"prepare": "husky"` to root `package.json`.

**Acceptance:**
- `pnpm lint` from root runs across all packages with no errors.
- Try to commit a file with `var x = 1;` (no const/let) → blocked by pre-commit hook.
- Try to commit with message `wip` → blocked by commitlint.
- Open PR on GitHub → CI runs lint + typecheck + build automatically.
- `docker build -t trend-backend apps/backend` produces a < 200 MB image that boots.
- New team member can read CONTRIBUTING.md and submit their first PR without asking the lead.

**Effort:** 3–4 hours.
**Note:** DO NOT touch `apps/backend/src/modules/api-sync/*` — that's Lead's territory (Track A).

---

## After Phase A Lands

Anyone finishing early can pick up **Phase B prep** (low-risk, lots of reading):

1. **Embedding service skeleton** — write `apps/backend/src/modules/embeddings/embedding.worker.ts` as a stub. Reads from a queue, calls `getEmbeddingProvider().embedBatch()`, writes `paper.embedding` and `paper.hasEmbedding = true`. Don't wire to BullMQ yet.
2. **Read Atlas Vector Search docs** — understand `$vectorSearch` aggregation stage, `numCandidates` vs `limit`, score thresholds.
3. **Prototype semantic search controller** — `modules/search/search.controller.ts` accepting `{ query, k }`, returns top-k papers. Use a fake embedding first (random 768-dim vector) — real embeddings come once Track A has data.
4. **Read OpenAI prompt-engineering best practices** for Gemini equivalent (Phase C report generation).

---

## Decision Log for Phase A

If anything in this doc conflicts with reality (a library moved, an API changed), document the decision in the Phase A spec under a `## Decision Log` section. Don't hide breaking changes in a commit message — surface them so the next phase doesn't re-debate.

---

## Done Definition for Phase A

Phase A is done when **all** of these are true on `dev` branch:

- [ ] Track A: `POST /api/v1/admin/sync` triggers a job that syncs ≥ 100 OpenAlex papers, with `paper_source_records` and `paper_quality_checks` populated. Re-running shows duplicates.
- [ ] Track B: web auth flow already shipped (`9e1002c`).
- [ ] Track C: mobile auth flow working in Expo Go on a real device.
- [ ] Track D: 404, ErrorBoundary, ThemeToggle, PaperCard, EmptyState all merged.
- [ ] Track E: CI green on every PR; pre-commit hooks active locally; `docker build` succeeds.
- [ ] CLAUDE.md §10 (Roadmap) updated to mark Phase A as done.
- [ ] Lead merges `dev` → `main` with a single conventional-commit message: `feat: Phase A — data pipeline + auth flows`.
