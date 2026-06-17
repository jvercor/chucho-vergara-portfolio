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
<div className="glass-card border border-border/40 bg-card/80 neon-glow-pink group-hover:border-neon-pink transition-all duration-500 rounded-xl">
```

| Part                              | Layer              | Effect                          |
|-----------------------------------|--------------------|---------------------------------|
| `glass-card`                      | CSS `@layer components` | `backdrop-filter: blur(12px)` |
| `border border-border/40`         | Tailwind utility   | Adaptive border (dark: `#564051`, light: `#C4B8D8`) |
| `bg-card/80`                      | Tailwind utility   | Semi-transparent adaptive bg (dark: `#1f1f1f`, light: `#ffffff`) |
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

## Theme-aware text colors

**Critical distinction:** most color tokens in `tailwind.config.mjs` are **static hex** — they do not change between Dark and Light Theme. Only tokens that map to a CSS custom property (via `@theme inline` in `globals.css`) adapt to the current theme.

### Use these for text outside intentionally dark surfaces

| Token | Dark value | Light value | Use for |
|-------|-----------|-------------|---------|
| `text-foreground` | `#e2e2e2` | `#120016` | Headings, primary text |
| `text-muted-foreground` | `#dcbed3` | `#6B5F7A` | Subtitles, supporting copy |

### Static tokens — do NOT use for exposed text

| Token | Value (always) | Problem |
|-------|---------------|---------|
| `text-white` | `#ffffff` | Invisible on light background |
| `text-on-surface` | `#e2e2e2` (dark-only) | No light mode equivalent |
| `text-on-surface-variant` | `#dcbed3` (dark-only) | Too light on light background |

**No exception for Glass Cards.** Glass Cards use `bg-card/80` (adaptive), which becomes near-white in Light Theme. Use `text-foreground` inside them.

---

## Buttons

Three button variants. All use `size="clear"` to disable Tailwind's size utilities and rely on their own padding.

### Primary Button (`btn-primary`)

```tsx
<Button variant="primary" size="clear">Label</Button>
```

| State   | Effect                                                                 |
|---------|------------------------------------------------------------------------|
| Rest    | Transparent background, image-textured border (CSS mask trick)         |
| Hover   | `scale(1.05)` + `brightness(1.15)`. No background fill.                |
| Focused | 2px `ring` outline, 4px offset                                         |

Scale is intentional here — the image-textured border scales with the element, which is fine.

### Hero Outline Button (`hero-outline`)

```tsx
<Button variant="hero-outline" size="clear">Label</Button>
```

| State   | Effect                                                                       |
|---------|------------------------------------------------------------------------------|
| Rest    | `border-border` border, transparent background, `text-foreground` text       |
| Hover   | Fills with `bg-foreground`, text flips to `text-background`, border removed  |

Fill-inversion adapts to theme: in Dark Theme `bg-foreground` is `#e2e2e2` (near-white fill, dark text); in Light Theme it is `#120016` (near-black fill, light text).

### Solid Button (`btn-solid`)

```tsx
<Button variant="solid" size="clear">Label</Button>
```

| State   | Effect                                             |
|---------|----------------------------------------------------|
| Rest    | `bg-white text-black` — theme-independent          |
| Hover   | `scale(1.05)` + `brightness(1.05)`                 |
| Focused | 2px `ring` outline, 4px offset                     |

Always literal white regardless of theme. Use as a high-contrast CTA where neither the textured-border nor the outline treatment fits. Also available in Payload CMS link fields as appearance `"solid"` (maps to this variant in all CTA blocks).

### CMS appearance → variant mapping

| CMS `appearance` | Button variant |
|---|---|
| `default` | `primary` |
| `outline` | `hero-outline` |
| `solid` | `solid` |

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

---

## Typography

### Font stack

| Role | Font | CSS variable |
|------|------|--------------|
| Headings (h1–h6) | Geist Sans ExtraBold (800) | `var(--font-heading)` → `var(--font-geist-sans)` |
| Body / UI text | Inter (400, 500, 700) | `var(--font-sans)` → `var(--font-inter)` |
| Monospace / code | Geist Mono | `var(--font-mono)` → `var(--font-geist-mono)` |

Inter is loaded via `next/font/google` in `src/app/(frontend)/layout.tsx`. The CSS variable `--font-inter` is injected by the Next.js font system and consumed by `--font-sans` in `@theme`.

### Type scale tokens

| Token | Size | Line height | Weight | Font |
|-------|------|-------------|--------|------|
| `headline-lg` | 48px | 56px | 800 | Geist Sans |
| `headline-lg-mobile` | 32px | 40px | 800 | Geist Sans |
| `headline-md` | 32px | 40px | 800 | Geist Sans |
| `headline-sm` | 24px | 32px | 800 | Geist Sans |
| `body-lg` | 18px | 28px | 400 | Inter |
| `body-md` | 16px | 24px | 400 | Inter |
| `body-sm` | 14px | 20px | 400 | Inter |
| `label-caps` | 12px | 16px | 700 | Inter |
| `mono-code` | 14px | 20px | 500 | Geist Mono |

Use the compound `text-{token}` utility (sets font-family + size + weight together):

```tsx
<h1 className="text-headline-lg">Page title</h1>
<p className="text-body-md">Body copy</p>
```

Headings `h1`–`h6` already receive `font-family: var(--font-heading); font-weight: 800` from `@layer base`, so plain semantic headings render correctly without an explicit class.

---

## Mobile Navigation

The Nav adapts responsively: horizontal links on desktop, collapsible drawer on mobile/tablet.

### Breakpoint behavior

| Screen size | Display pattern |
|-------------|-----------------|
| `< 768px` (below md) | Nav Toggle button visible, desktop nav hidden |
| `≥ 768px` (md and up) | Desktop horizontal nav visible, Nav Toggle hidden |

Use Tailwind responsive prefixes: `md:hidden` for mobile-only elements, `hidden md:flex` for desktop-only.

### Nav Toggle (hamburger button)

The button that opens the Nav Drawer on mobile.

```tsx
<button
  className="w-10 h-10 flex items-center justify-center text-foreground hover:text-neon-pink transition-colors md:hidden"
  aria-label="Toggle navigation"
>
  {/* Three span elements for hamburger, see implementation */}
</button>
```

| Spec | Value |
|------|-------|
| Button size | 40x40px (`w-10 h-10`) |
| Icon size | 24px (spans sized accordingly) |
| Color | `text-foreground` rest, `hover:text-neon-pink` |
| Animation | Three `<span>` elements transform to X when open |
| Transition | `transition-colors` on color, `transition-transform duration-300` on spans |

**Hamburger → X animation:** Top span rotates 45deg and translates, middle span fades out (`opacity-0`), bottom span rotates -45deg and translates. All spans use `transition-transform duration-300 ease-out`.

### Nav Drawer

The slide-in overlay panel containing navigation links.

```tsx
<div className="fixed inset-y-0 right-0 w-[85vw] bg-background/90 backdrop-blur-sm border-l border-border z-50 flex flex-col items-center justify-center gap-6 transition-transform duration-300">
  {/* Nav links here */}
</div>
```

| Spec | Value |
|------|-------|
| Position | `fixed inset-y-0 right-0` (full height, right edge) |
| Width | `w-[85vw]` (leaves 15% visible) |
| Background | `bg-background/90 backdrop-blur-sm` (matches Header when scrolled) |
| Border | `border-l border-border` |
| Z-index | `z-50` |
| Layout | `flex flex-col items-center justify-center` (vertically centered) |
| Link spacing | `gap-6` between links |
| Animation | Slide only (no fade), `transition-transform duration-300 ease-out` |

**States:**
- **Closed:** `translate-x-full` (off-screen right)
- **Open:** `translate-x-0` (visible)

**Link styling inside drawer:**
- Large touch targets: `text-headline-sm py-4` (bigger than desktop)
- Center-aligned with parent flex
- Active link: `text-neon-pink`
- Inactive links: `text-foreground hover:text-neon-pink`

### Backdrop

The semi-transparent overlay behind the drawer.

```tsx
<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
```

| Spec | Value |
|------|-------|
| Position | `fixed inset-0` (full viewport) |
| Background | `bg-black/50 backdrop-blur-sm` |
| Z-index | `z-40` (below drawer, above everything else) |
| Transition | `transition-opacity duration-300` |

**States:**
- **Hidden:** `opacity-0 pointer-events-none`
- **Visible:** `opacity-100`

### Active link indication

Both desktop and mobile nav must indicate the current page.

```tsx
// Check current route
const pathname = usePathname()
const isActive = link.url === pathname

// Apply conditional color
<CMSLink
  className={cn(
    "transition-colors no-underline hover:no-underline",
    isActive ? "text-neon-pink" : "text-foreground hover:text-neon-pink"
  )}
/>
```

Active links use `text-neon-pink` regardless of hover state. Inactive links use `text-foreground` and `hover:text-neon-pink`.

### Accessibility requirements

| Requirement | Implementation |
|-------------|----------------|
| **Focus trap** | When drawer is open, Tab/Shift+Tab cycles only through drawer elements (X button → nav links → back to X). Focus returns to Nav Toggle when closed. |
| **Scroll lock** | Apply `overflow-hidden` to `<body>` when drawer is open. Remove when closed. |
| **Keyboard close** | Pressing Escape closes the drawer. |
| **ARIA labels** | Nav Toggle button needs `aria-label="Toggle navigation"` and `aria-expanded={isOpen}`. |
| **Focus management** | When drawer opens, focus moves to first interactive element (X button or first link). When closed, focus returns to Nav Toggle. |

### Close mechanisms

The drawer closes via:
1. **X button tap** (Nav Toggle when in X state)
2. **Backdrop tap** (anywhere outside drawer)
3. **Nav link tap** (automatic close after navigation)
4. **Escape key**

All close actions should trigger the same close handler to ensure consistent state updates (drawer translate, backdrop fade, scroll unlock, focus return).

### Z-index layer reference

| Element | Z-index | Rationale |
|---------|---------|-----------|
| Page content | default | Base layer |
| Header | `z-20` | Sticky, above content |
| Backdrop | `z-40` | Above page, below drawer |
| Nav Drawer | `z-50` | Highest UI layer |
