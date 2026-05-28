# Design System — Layout & Visual Rules

Reference for implementing blocks and components consistently. For domain language and terminology, see `CONTEXT.md`. For architectural decisions, see `docs/adr/`.

---

## Block layout wrapper

Every block **must** use `container` as its outermost horizontal layout class.

```tsx
// ✅ Correct
<section className="container py-section-gap">…</section>

// ❌ Wrong — hardcoded max-width, wrong gutter
<section className="max-w-[1440px] mx-auto px-gutter">…</section>

// ❌ Wrong — bare mx-auto without container constraints
<section className="mx-auto px-4">…</section>
```

### What `container` does

Defined in `src/app/(frontend)/globals.css`. It is **not** Tailwind's built-in container — it is a project-specific responsive utility:

| Breakpoint | Max-width   | Padding-inline |
|------------|-------------|----------------|
| base       | 100%        | 1rem (16px)    |
| ≥ md       | 48rem       | 2rem (32px)    |
| ≥ lg       | 64rem       | 2rem           |
| ≥ xl       | 80rem       | 2rem           |
| ≥ 2xl      | 86rem       | 2rem           |

Do **not** add `px-gutter` or `px-*` alongside `container` — it already handles horizontal padding.

---

## Vertical spacing

Each block controls its own vertical rhythm. Use the spacing tokens from `tailwind.config.mjs`:

| Token            | Value  | Use when                                      |
|------------------|--------|-----------------------------------------------|
| `py-section-gap` | 120px  | Full-bleed hero sections, prominent blocks    |
| `my-16`          | 64px   | Standard content blocks (Content, Archive…)   |
| `mb-16`          | 64px   | Block with content only below (no top gap)    |

---

## Glass Card

Applied to content cards. Always use all three parts together:

```tsx
<div className="glass-card border border-outline-variant/30 bg-surface-container-low neon-glow-pink group-hover:border-neon-pink transition-all duration-500 rounded-xl">
```

| Part                              | Layer              | Effect                          |
|-----------------------------------|--------------------|---------------------------------|
| `glass-card`                      | CSS `@layer components` | `backdrop-filter: blur(12px)` |
| `border border-outline-variant/30`| Tailwind utility   | Subtle border at rest           |
| `bg-surface-container-low`        | Tailwind utility   | Dark background                 |
| `neon-glow-pink`                  | CSS `@layer components` | Pink glow box-shadow on hover |
| `group-hover:border-neon-pink`    | Tailwind utility   | Border color change on hover    |
| `transition-all duration-500`     | Tailwind utility   | Smooth transition               |

**Specificity note:** Border-color hover must use the Tailwind utility `group-hover:border-neon-pink` (not CSS). Tailwind `@layer utilities` beats `@layer components`, so CSS hover overrides won't work without `!important` — which is banned.

---

## Typography tokens

All text must use the project font scale. Never use raw Tailwind font sizes (`text-xl`, `text-sm`, etc.):

| Token               | Usage                      |
|---------------------|----------------------------|
| `font-headline-md text-headline-md` | Section headings (h2) |
| `font-headline-sm text-headline-sm` | Card headings (h3)    |
| `font-body-md text-body-md`         | Body copy              |
| `font-label-caps text-label-caps`   | Caps labels, tags      |
| `font-mono-code text-mono-code`     | Code snippets          |

Tokens are defined in `tailwind.config.mjs` under `theme.extend.fontFamily` and `theme.extend.fontSize`.

---

## Color tokens

Use semantic tokens, not raw hex. All colors are defined in `tailwind.config.mjs`:

- **Text:** `text-white`, `text-on-surface-variant`, `text-neon-pink`
- **Surfaces:** `bg-surface-container-low`, `bg-surface-container`, `bg-surface-container-high`
- **Borders:** `border-outline-variant/30`, `border-neon-pink`
- **Accent:** `text-neon-pink`, `bg-neon-pink/10`

`var(--neon-pink)` is a real CSS custom property. Most other tokens are static hex in Tailwind config — do **not** use `var(--surface-container)` etc. in CSS.
