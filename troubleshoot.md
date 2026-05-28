# Troubleshooting Log

Running log of issues encountered during development, with root cause and resolution. Add entries as they happen — newest at the top.

---

## Admin panel 500 — `folders_id` column missing from `payload_locked_documents_rels`
**Date**: 2026-05-28
**Symptom**: `/admin` returns 500 for every request. Vercel runtime logs show:
```
Error: Failed query — column payload_locked_documents__rels.folders_id does not exist
```
**Root cause**: Migration `20260527_044348` had a no-op `up()` ("Schema already applied via dev-mode push"), relying on a dev DB push that was subsequently lost. The migration was already recorded in `payload_migrations` as applied (batch 2), so Payload never re-ran it. The `folders` table and `folders_id` column it was supposed to create never actually existed in the live DB. The Payload config defines a custom `folders` collection (`folders: true`), which causes Payload to reference `folders_id` in every `payload_locked_documents_rels` query — including the one that bootstraps the admin panel.

**Fix**:
1. Run the following SQL directly on the live DB:
```sql
CREATE TABLE IF NOT EXISTS "folders" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar NOT NULL,
  "folder_id" integer,
  "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);
ALTER TABLE "folders" ADD CONSTRAINT "folders_folder_id_payload_folders_id_fk"
  FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
CREATE INDEX IF NOT EXISTS "folders_folder_idx" ON "folders" USING btree ("folder_id");
CREATE INDEX IF NOT EXISTS "folders_updated_at_idx" ON "folders" USING btree ("updated_at");
CREATE INDEX IF NOT EXISTS "folders_created_at_idx" ON "folders" USING btree ("created_at");
ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "folders_id" integer;
ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_folders_fk"
  FOREIGN KEY ("folders_id") REFERENCES "public"."folders"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("folders_id");
```
2. Migration `src/migrations/20260527_044348.ts` `up()` was updated with the same SQL (with `IF NOT EXISTS` guards) so future fresh installs apply it correctly.

**Key lesson**: Never write a no-op `up()` unless you are certain the dev-push state is permanent and will never be lost. If the DB is reset or re-provisioned, the migration record will block the schema from ever being re-applied.

---

## `solid` enum value missing from link appearance types
**Date**: 2026-05-28
**Symptom**: Saving any content with a `solid` button appearance fails at the DB level (Payload does not surface a clear error in the admin UI, but the save silently fails or returns an error).
**Root cause**: Migration `20260528_092154_add_solid_button_appearance` was misnamed — its `up()` only contained unrelated `projects`/`stack`/`search` schema changes, not the 6 `ALTER TYPE … ADD VALUE 'solid'` statements needed to add `solid` to the link appearance enums. The `solid` appearance was present in application code (`src/fields/link.ts`, CTA/content block configs) but missing from the 6 DB enum types (`enum_pages_hero_links_link_appearance`, `enum__pages_v_version_hero_links_link_appearance`, `enum_pages_blocks_cta_links_link_appearance`, `enum__pages_v_blocks_cta_links_link_appearance`, `enum_pages_blocks_content_columns_link_appearance`, `enum__pages_v_blocks_content_columns_link_appearance`).
**Fix**:
1. Applied `ALTER TYPE … ADD VALUE IF NOT EXISTS 'solid'` for all 6 enums directly on the live DB.
2. Migration file `src/migrations/20260528_092154_add_solid_button_appearance.ts` updated to include the 6 `ALTER TYPE` statements so future fresh installs have the correct enum values.

**Note**: This bug did **not** cause the admin panel 500 (that was the `folders_id` issue above). It would only manifest when a user tried to save content with `solid` appearance.

---

## `slugField()` must not be spread in Payload v3 collections
**Date**: 2026-05-28
**Symptom**: Runtime error — "slugField is not a function or its return value is not iterable" when opening a collection entry in the admin panel.
**Root cause**: `slugField()` from `payload` returns a single `RowField`, not an array. Spreading it (`...slugField()`) causes a runtime failure.
**Fix**: Use `slugField()` without spread as a standalone entry in the `fields` array.

---

## New Payload collections must be added to `generatePreviewPath` map
**Date**: 2026-05-28
**Symptom**: Admin live-preview URL is malformed (`undefined/slug`), causing broken preview behavior when creating a new collection.
**Root cause**: `src/utilities/generatePreviewPath.ts` contains a `collectionPrefixMap` object. Collections not listed in this map return `undefined` as the path prefix.
**Fix**: Add the new collection slug and its URL prefix to `collectionPrefixMap` (e.g., `projects: '/projects'`).

---

## Logo hydration mismatch (`src` attribute)
**Date**: 2026-05-27
**Symptom**: React hydration error — `src` on the `Logo` img differed between server render (`/logo-black.svg`) and client hydration (`/logo-white.svg`).
**Root cause**: `useTheme()` returns `undefined` during SSR (no DOM access), so the server always picks the light-theme logo. After hydration, the client resolves the real theme from the cookie and picks the dark logo — causing a `src` mismatch.
**Fix**: Applied the same `mounted` guard pattern used by `ThemeSelector`. The `src` for `variant="auto"` now resolves to the default (`/logo-black.svg`) until after mount, then switches to the theme-correct logo. Added `suppressHydrationWarning` on the `<img>` element to suppress any residual mismatch warning.

---


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

## `border-image` incompatible with `border-radius`
**Date**: 2026-05-27
**Symptom**: Applying `border-image` (image-based border) on a button ignored `border-radius` — corners stayed sharp regardless of the radius value set.
**Root cause**: This is a CSS spec limitation. `border-image` overrides `border-style` and renders the image outside the element's shape, bypassing `border-radius` entirely.
**Fix**: Use the CSS mask trick via a `::before` pseudo-element instead. The pseudo-element fills the button area with the image as a `background`, then a `mask` with `mask-composite: exclude` punches out the center — leaving only the border ring. Since `border-radius` is inherited by `::before`, the rounded shape is respected.
```css
.btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 3px; /* border thickness */
  background: url('/button.jpg') center / 105% 105% no-repeat;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
}
```

---


## `Cannot find field for path at _status` on static build

**Date**: 2026-05-28
**Symptom**: `Error occurred prerendering page "/projects"` — `Cannot find field for path at _status` during `next build`. The `/posts` listing page with an identical query pattern did not fail.
**Root cause**: The `authenticatedOrPublished` access function returns `{ _status: { equals: 'published' } }` when no user is present. With `overrideAccess: false`, Payload applies this filter at query time. During static generation there is no authenticated user, so the filter is always applied. An interaction between the `select` clause and Payload's internal `_status` field resolution causes it to fail on the `projects` collection (exact root cause in Payload internals unclear — the `posts` page with the same pattern was unaffected, possibly due to no published posts existing in the DB at build time).
**Fix**: Remove `overrideAccess: false` from the listing-page query. Access control is not meaningful for a fully public portfolio listing built statically. If draft filtering is needed, add an explicit `where: { _status: { equals: 'published' } }` alongside removing `overrideAccess` — but note this only works once the DB has the `_status` column (requires migrations to have run).

---

## `payload migrate` hangs indefinitely without a live DB connection

**Date**: 2026-05-28
**Symptom**: Running `npx payload migrate` from the CLI hangs with no output and never exits.
**Root cause**: The migrate command tries to connect to the database before doing anything. If the DB is not reachable (e.g., not started, wrong env vars), it blocks waiting for the connection rather than failing fast.
**Fix**: Ensure the database is running and `DATABASE_URI` in `.env` is correct before running migrations. Check with `npx payload migrate:status` first — if that also hangs, the DB is not reachable.

---


**Date**: YYYY-MM-DD
**Symptom**: What went wrong / what error appeared
**Root cause**: Why it happened
**Fix**: What resolved it
-->
