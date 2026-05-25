# Mobile — Publication Trend System

Expo SDK 52 + React Native + TypeScript + Expo Router + NativeWind (Tailwind for RN).

## Quick start

```bash
# from repo root
pnpm install
cp apps/mobile/.env.example apps/mobile/.env
pnpm dev:mobile                # opens Expo dev tools
```

Then:
- Press **`a`** for Android emulator (needs Android Studio installed)
- Press **`i`** for iOS simulator (Mac only)
- Or scan the QR code with **Expo Go** on your phone

## Why these files

- **[metro.config.js](metro.config.js)** — pnpm hoists deps differently from npm/yarn. Without the `watchFolders` and `nodeModulesPaths` tweaks, Metro will throw "Unable to resolve module" for `@trend/shared-types`.
- **[babel.config.js](babel.config.js)** — wires up `nativewind/babel` and tells Babel to use `nativewind` as the JSX import source so `className` works on RN components.
- **[global.css](global.css)** — Tailwind entry, imported once in `app/_layout.tsx`.

## Layout

```
app/                  expo-router file-based routes
├── _layout.tsx       providers (QueryClient, GestureHandler, SafeArea)
└── index.tsx         home screen
lib/
├── api-client.ts     axios with auto-resolving dev host + JWT refresh
├── auth-store.ts     zustand persisted to expo-secure-store
└── query-client.ts   react-query defaults (longer retry on mobile)
```

## Add a tabs layout (later)

```bash
# create app/(tabs)/_layout.tsx and individual tab screens
# expo-router treats parens as group folders that don't show in the URL
```
