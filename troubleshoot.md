# Troubleshooting Log

Running log of issues encountered during development, with root cause and resolution. Add entries as they happen — newest at the top.

---

## Theme toggle `aria-label` hydration mismatch
**Date**: 2026-05-27
**Symptom**: React hydration warning — `aria-label` on the `ThemeSelector` button differed between server and client renders. Server rendered `"Switch to dark theme"` (theme `undefined`), client hydrated with `"Switch to light theme"` (theme `'dark'`).
**Root cause**: The `aria-label` is derived from `theme`, which is `undefined` during SSR and resolved to `'dark'` on the client after `useEffect` runs. React flags any attribute mismatch even when `suppressHydrationWarning` is on a parent.
**Fix**: Added `suppressHydrationWarning` directly to the `<button>` element in `ThemeSelector`.

---

## Script-tag warning + theme icon hydration mismatch
**Date**: 2026-05-27
**Symptom**: Two errors — (1) "Encountered a script tag while rendering React component"; (2) React hydration mismatch on the `ThemeSelector` icon (Sun vs Moon) because the server and client disagreed on the active theme.
**Root cause**: The theme was initialised only via `localStorage` in `ThemeProvider.useEffect`, which runs client-side only. The server had no way to know the user's saved theme, so it rendered with `defaultTheme` while the client hydrated with the stored preference — causing the icon mismatch. The script warning was a separate React 19 constraint (see entry below).
**Fix**: Replaced the script + localStorage-only approach with a cookie-based SSR strategy:
- `ThemeProvider.setTheme` now writes `payload-theme` as a cookie alongside `localStorage`.
- `layout.tsx` reads that cookie server-side via `next/headers/cookies()` and stamps `data-theme` on `<html>` before the page reaches the client.
- `ThemeSelector` uses a `mounted` guard so the icon renders only after hydration, avoiding the initial mismatch.

---

## `next/script` "beforeInteractive" unusable in nested components (React 19 / Next.js App Router)
**Date**: 2026-05-27
**Symptom**: Console error — "Encountered a script tag while rendering React component. Scripts inside React components are never executed when rendering on the client." First appeared in `InitTheme` (a wrapper component), persisted after moving the `<Script strategy="beforeInteractive">` directly into `RootLayout`.
**Root cause**: React 19 emits this warning for any `<script>` node rendered anywhere in the component tree during client-side reconciliation, including the root layout. `next/script` with `strategy="beforeInteractive"` is injected into the document by Next.js's build pipeline — it is not meant to appear as a JSX node in component output.
**Fix**: Removed the script entirely. Theme initialisation was replaced by the SSR cookie approach (see entry above), making a blocking init script unnecessary.

---

<!-- TEMPLATE
## [short title]
**Date**: YYYY-MM-DD
**Symptom**: What went wrong / what error appeared
**Root cause**: Why it happened
**Fix**: What resolved it
-->
