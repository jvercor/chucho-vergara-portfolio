# Troubleshooting Log

Running log of issues encountered during development, with root cause and resolution. Add entries as they happen — newest at the top.

---

## `CREATE TYPE IF NOT EXISTS` causes migration syntax error
**Date**: 2026-06-01
**Symptom**: Deployment fails during `pnpm run ci` / `payload migrate` with:
```
caused by: error: syntax error at or near "NOT"
```
The failing query contains `CREATE TYPE IF NOT EXISTS "public"."<enum_name>" AS ENUM(...)`.
**Root cause**: PostgreSQL does not support `IF NOT EXISTS` on `CREATE TYPE`. It is only valid on `CREATE TABLE`, `CREATE INDEX`, and a few other DDL statements — not on type creation.
**Fix**: Remove `IF NOT EXISTS` from any `CREATE TYPE` statement in migration files. Migrations only run once (Payload tracks applied migrations in `payload_migrations`), so the guard is unnecessary — and invalid.
```sql
-- ❌ Invalid
CREATE TYPE IF NOT EXISTS "public"."enum_foo" AS ENUM('a', 'b');

-- ✅ Correct
CREATE TYPE "public"."enum_foo" AS ENUM('a', 'b');
```

---

## Always use `pnpm add` to install packages — `npm install` fails

**Date**: 2026-06-01
**Symptom**: Running `npm install <pkg>` errors with `Cannot read properties of null (reading 'matches')` and exits with code 1 after several minutes.
**Root cause**: The project lockfile is managed by pnpm. npm's arborist cannot reconcile the pnpm-managed `node_modules/.pnpm` tree and crashes during ideal-tree computation.
**Fix**: Always use `pnpm add <pkg>` (or `pnpm add -D <pkg>` for dev deps) to install new packages in this project.

---

## Payload scaffolds duplicate `ALTER TYPE ADD VALUE` in new migrations

**Date**: 2026-06-01
**Symptom**: A newly scaffolded migration's `up()` contains `ALTER TYPE "public"."<enum>" ADD VALUE '<value>'` for enum values that were already added by a prior migration — and without `IF NOT EXISTS`. This causes the deploy to fail on the live DB where those values already exist.
**Root cause**: Payload computes the schema diff based on its own JSON snapshot, which may not perfectly reflect what prior migration files have already applied. It re-emits `ALTER TYPE ADD VALUE` statements for values it considers "new" even when a previous migration already handled them.
**Fix**: After running `npx payload migrate:create`, inspect the generated `up()` and remove any `ALTER TYPE … ADD VALUE` lines that duplicate statements already present in earlier migration files. Replace bare `CREATE TYPE` / `CREATE TABLE` / `CREATE INDEX` with `IF NOT EXISTS` variants as a general safety measure.

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

## Enum value added to code but missing from DB — saves fail silently
**Date**: 2026-05-28
**Symptom**: Saving content that uses a new enum option fails. Vercel logs show `invalid input value for enum <enum_name>: "<value>"`. The admin UI shows a notification error or silently fails to save.
**Root cause**: A new option was added to a `select` field in code (or `payload-types.ts` was regenerated) but the corresponding `ALTER TYPE … ADD VALUE` statement was never added to a migration. The DB enum still only knows about the old values.

**Known occurrences on this project**:
- `solid` on 6 link appearance enums — migration `20260528_092154_add_solid_button_appearance` was misnamed and its `up()` only contained unrelated schema changes. Fixed by applying `ALTER TYPE … ADD VALUE IF NOT EXISTS 'solid'` on all 6 enums and updating the migration file.
- `homeHero` on `enum_pages_hero_type` and `enum__pages_v_version_hero_type` — added to `src/heros/config.ts` but missing from the `up()` of migration `20260527_044348` (despite the `down()` correctly rolling it back). Fixed by applying `ALTER TYPE … ADD VALUE IF NOT EXISTS 'homeHero'` on both enums and updating the migration file.

**Fix (general pattern)**:
1. Run `ALTER TYPE "public"."<enum_name>" ADD VALUE IF NOT EXISTS '<new_value>';` on the live DB for each affected enum.
2. Add the same statement to the relevant migration's `up()` so fresh installs stay in sync.

**How to find affected enums**: search `payload-types.ts` for the field type — the union of string literals is the source of truth for what values should exist in the DB enum.

**Note**: The `solid` bug did **not** cause the admin panel 500 (that was the `folders_id` issue above).

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


## `Cannot find field for path at _status` — `authenticatedOrPublished` on a collection without drafts

**Date**: 2026-05-28
**Symptom**: `Cannot find field for path at _status` — either during `next build` (prerender error) or at runtime (500 on a page that fetches related data with `depth ≥ 1`).
**Root cause**: `authenticatedOrPublished` returns `{ _status: { equals: 'published' } }` when no authenticated user is present. Payload applies this as a DB filter, but `_status` only exists on collections with `versions: { drafts: true }`. Any collection using `authenticatedOrPublished` **without** drafts enabled will fail as soon as an unauthenticated request triggers the access function.

This also affects **related collections fetched at depth**: if Collection A has drafts and Collection B does not, a query on A with `depth: 1` and `overrideAccess: false` will also run the access function on B's rows — causing the same error.

**Known occurrences on this project**:
- `/projects` listing page (static build) — `projects` collection query used `overrideAccess: false`. Fixed by removing `overrideAccess: false` from that query.
- `/projects/[slug]` at runtime — `queryProjectBySlug` fetches with `depth: 1`, populating related `stack` items. `Stack` collection used `authenticatedOrPublished` but has no drafts/`_status` column. Fixed by changing `Stack.read` to `() => true`.

**Fix (general)**:
- If the collection has no drafts: use `() => true` for read access instead of `authenticatedOrPublished`.
- If the collection has drafts but the query is public/static: remove `overrideAccess: false` and add an explicit `where: { _status: { equals: 'published' } }` if filtering is needed.
- Rule of thumb: only use `authenticatedOrPublished` on collections that have `versions: { drafts: true }`.

---

## `payload migrate` hangs indefinitely without a live DB connection

**Date**: 2026-05-28
**Symptom**: Running `npx payload migrate` from the CLI hangs with no output and never exits.
**Root cause**: The migrate command tries to connect to the database before doing anything. If the DB is not reachable (e.g., not started, wrong env vars), it blocks waiting for the connection rather than failing fast.
**Fix**: Ensure the database is running and `DATABASE_URI` in `.env` is correct before running migrations. Check with `npx payload migrate:status` first — if that also hangs, the DB is not reachable.

---

## New CMS pages return 500 (`DYNAMIC_SERVER_USAGE`) immediately after publishing

**Date**: 2026-06-02
**Symptom**: A page freshly published in the Payload admin returns HTTP 500. Vercel runtime logs show:
```
[Error: An error occurred in the Server Components render. The specific message is omitted in production builds...]
digest: 'DYNAMIC_SERVER_USAGE'
Failed to handle /<slug>
```
**Root cause**: When a page is published, the `revalidatePage` hook calls `revalidatePath(path)` and `revalidateTag('pages-sitemap')`. This schedules a background ISR revalidation. During that first revalidation pass, the page is temporarily unavailable and concurrent requests may receive 500s. The error resolves itself once the revalidation completes and the cache re-populates.

This typically affects pages published **after** the last deployment (not yet in `generateStaticParams`). They have no pre-built static version, so Next.js renders them on-demand; the initial on-demand render and simultaneous ISR warming can briefly conflict.

**Fix**: Wait 15–30 seconds after publishing and refresh. The page will serve correctly once the ISR revalidation cycle finishes. No code change required.

If the error **persists** beyond a minute, check:
1. The page has `_status: 'published'` in the DB (not stuck in draft).
2. No block on the page is calling a dynamic API inside `unstable_cache` (see `getCachedGlobal` / `getCachedRedirects` patterns).
3. No related collection uses `authenticatedOrPublished` without drafts (see `_status` entry above).

---

## TypeScript type error: `RefObject<HTMLDivElement>` vs `RefObject<HTMLDivElement | null>`

**Date**: 2026-06-17
**Symptom**: Build fails with TypeScript error:
```
Type 'RefObject<HTMLDivElement | null>' is not assignable to type 'RefObject<HTMLDivElement>'.
  Type 'HTMLDivElement | null' is not assignable to type 'HTMLDivElement'.
```
**Root cause**: React's `useRef<T>(null)` creates a `RefObject<T | null>`, but the type signature was declared as `RefObject<T>` (without `| null`). When passing the ref between components or as a prop, TypeScript enforces strict nullability checks.

**Fix**: Change the ref type to explicitly include `null`:
```tsx
// ❌ Wrong
const containerRef = useRef<HTMLDivElement>(null)

// ✅ Correct
const containerRef = useRef<HTMLDivElement | null>(null)
```
Update both the hook's internal ref and any component prop types that receive the ref to use `RefObject<HTMLDivElement | null>`.

**Known occurrences on this project**:
- `src/hooks/useFocusTrap.ts` — changed `containerRef` type to `RefObject<HTMLDivElement | null>`
- `src/Header/Nav/NavDrawer.tsx` — updated `focusTrapRef` prop type to match

---

## CMSLink component does not accept `onClick` prop

**Date**: 2026-06-17
**Symptom**: Build fails with TypeScript error:
```
Property 'onClick' does not exist on type 'IntrinsicAttributes & CMSLinkType'.
```
**Root cause**: The `CMSLink` component (`src/components/Link/index.tsx`) is a wrapper around `next/link` and `Button`, but it doesn't forward or accept an `onClick` prop. It only accepts the props defined in `CMSLinkType` (appearance, label, url, reference, etc.).

**Fix**: Wrap the `CMSLink` in a `<div>` with the `onClick` handler instead of passing it to `CMSLink`:
```tsx
// ❌ Wrong
<CMSLink {...link} onClick={handleClick} />

// ✅ Correct
<div onClick={handleClick}>
  <CMSLink {...link} />
</div>
```

**Known occurrences on this project**:
- `src/Header/Nav/NavDrawer.tsx` — wrapped nav links in `<div onClick={handleLinkClick}>` to close drawer after navigation

**Alternative approach**: If `onClick` is needed frequently, consider extending `CMSLinkType` to accept `onClick` and forward it through to the underlying `Link`/`Button`. For one-off cases, the wrapper div is simpler.

---


**Date**: YYYY-MM-DD
**Symptom**: What went wrong / what error appeared
**Root cause**: Why it happened
**Fix**: What resolved it
-->
