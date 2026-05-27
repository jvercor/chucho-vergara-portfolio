# Hybrid page architecture: purpose-built routes + CMS catch-all

The portfolio has three tiers of pages that coexist in Next.js App Router without conflict:

1. **Hardcoded layout + CMS data** — Home, Projects list, Resume, Blog list. The layout is owned in code; Payload supplies the content via its collections. These live as dedicated routes (`/projects/page.tsx`, `/resume/page.tsx`, etc.).
2. **CMS template + CMS content** — individual Project and Blog Post detail pages. A single Next.js template renders whatever Payload returns. These use the existing `[slug]` dynamic route.
3. **Fully CMS-managed** — the `Pages` collection handles future one-off pages (e.g., `/contact`, `/uses`) without requiring code changes.

We keep the `Pages` collection rather than removing it because it costs nothing and provides an escape hatch for future pages that don't warrant a dedicated route. The `[slug]` catch-all only activates when no dedicated route matches, so there is no conflict.

## Consequences

Purpose-built pages are always preferred over CMS pages for any section with a unique layout or interactive behaviour (e.g., Home with the Three.js scene, Resume with its structured sections). The `Pages` collection is a last resort, not the default.
