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

## Buttons

Two button variants. Both use `size="clear"` to disable Tailwind's size utilities and rely on their own padding.

### Primary Button (`btn-primary`)

```tsx
<Button variant="primary" size="clear">Label</Button>
```

| State   | Effect                                                                 |
|---------|------------------------------------------------------------------------|
| Rest    | Transparent background, image-textured border (CSS mask trick)         |
| Hover   | `brightness(1.15)` + `foreground` at 8% opacity as background fill     |
| Focused | 2px `ring` outline, 4px offset                                         |

**No scale on hover.** Scale was removed because it misaligns the image-textured border. Use brightness + fill to signal interactivity.

### Hero Outline Button (`hero-outline`)

```tsx
<Button variant="hero-outline" size="clear">Label</Button>
```

| State   | Effect                                                                       |
|---------|------------------------------------------------------------------------------|
| Rest    | `border-outline-variant` border, transparent background, white text          |
| Hover   | Fills with `bg-foreground`, text flips to `text-background`, border removed  |

The fill-inversion pattern works across themes: in Dark Theme `bg-foreground` is `#e2e2e2` (near-white fill, dark text); in Light Theme it is `#120016` (near-black fill, light text).


Use semantic tokens, not raw hex. All colors are defined in `tailwind.config.mjs`:

- **Text:** `text-white`, `text-on-surface-variant`, `text-neon-pink`
- **Surfaces:** `bg-surface-container-low`, `bg-surface-container`, `bg-surface-container-high`
- **Borders:** `border-outline-variant/30`, `border-neon-pink`
- **Accent:** `text-neon-pink`, `bg-neon-pink/10`

`var(--neon-pink)` is a real CSS custom property. Most other tokens are static hex in Tailwind config — do **not** use `var(--surface-container)` etc. in CSS.

---

## Theme & Color Strategy

This is the most common source of confusion. Read this before writing any styles.

### Two token systems

| System | Examples | Defined in | Adapts to theme? |
|---|---|---|---|
| **Semantic / adaptive** | `text-foreground`, `bg-background`, `text-muted-foreground`, `border-border`, `text-primary`, `bg-card` | `[data-theme='dark']` + `[data-theme='light']` blocks in `globals.css`, mapped via `@theme inline` | ✅ Yes |
| **Static DESIGN.md tokens** | `text-on-surface-variant`, `text-on-surface`, `border-outline-variant`, `bg-surface-container-low`, `text-white` | Hardcoded dark hex values in `tailwind.config.mjs` under `theme.extend` | ❌ No — always render as dark-palette values |

**Rule: use adaptive tokens by default.** Only reach for static tokens when you are certain the component is intentionally always dark.

### Adaptive token quick reference

| You need… | Use… | Not… |
|---|---|---|
| Body text | `text-foreground` | `text-white`, `text-on-surface` |
| Muted / secondary text | `text-muted-foreground` | `text-on-surface-variant` |
| Primary accent | `text-primary` / `bg-primary` | static hex |
| Subtle border | `border-border` | `border-outline-variant` |
| Card surface | `bg-card` | `bg-surface-container` |
| Neon pink (same both themes) | `text-neon-pink` / `bg-neon-pink` | ✅ safe either way |

### The `dark:` prefix

`@custom-variant dark` is defined as `(&:is([data-theme='dark'] *))`. Use it to provide dark overrides on otherwise adaptive components:

```tsx
<div className="bg-white dark:bg-card text-foreground">
```

### Static tokens are not wrong — use them knowingly

Static tokens (`text-on-surface-variant`, etc.) are valid when a component is intentionally dark-only by design. Document that intent with a comment so future agents don't "fix" it:
