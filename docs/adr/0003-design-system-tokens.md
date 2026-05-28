# Design system tokens: hyper-violet engineering source mapped to Tailwind

The portfolio's visual identity is sourced from a private HTML template called `hyper_violet_engineering` (gitignored at `stitch_minimalist_developer_portfolio/`). Its `DESIGN.md` defines the full token set: colors, typography scale, spacing, and border radius. Rather than copy raw CSS, the tokens are mapped into `tailwind.config.mjs` under `theme.extend` so they work as standard Tailwind utility classes.

## Token categories in `tailwind.config.mjs`

### Colors
Static hex values — not CSS variables — because the design system is dark-theme only (no light/dark split needed for these tokens). Key values:

| Token | Value | Usage |
|---|---|---|
| `neon-pink` | `var(--neon-pink)` (#ff01fb) | Primary accent, CTA glow, h2 role title |
| `on-surface` | `#e2e2e2` | Body text |
| `on-surface-variant` | `#dcbed3` | Tagline, muted text |
| `on-primary` | `#5c005a` | Text on filled primary buttons |
| `outline-variant` | `#564051` | Subtle borders (secondary button, decorative lines) |
| `russian-violet` | `var(--russian-violet)` | Atmospheric glow blobs (left) |
| `dark-violet` | `var(--dark-violet)` | Atmospheric glow blobs (right) |
| `primary` | `#ffabf1` | Badge border/bg tint, availability dot |

### Typography — fontFamily
All roles map to **Geist** (loaded via `next/font` in `layout.tsx`). The template spec calls for Inter — this was an explicit owner decision.

```js
'headline-lg':  ['var(--font-geist-sans)', 'sans-serif'],
'body-lg':      ['var(--font-geist-sans)', 'sans-serif'],
'label-caps':   ['var(--font-geist-sans)', 'sans-serif'],
'mono-code':    ['var(--font-geist-mono)', 'monospace'],
// ... all roles follow the same pattern
```

Use as `font-headline-lg`, `font-body-lg`, etc. These classes only set `font-family`.

### Typography — fontSize (compound values)
Each `text-*` token sets font-size, line-height, letter-spacing, and font-weight together:

| Token | size / lh / ls / weight |
|---|---|
| `text-headline-lg` | 48px / 56px / -0.02em / 700 |
| `text-headline-lg-mobile` | 32px / 40px / -0.01em / 700 |
| `text-headline-md` | 32px / 40px / -0.01em / 600 |
| `text-headline-sm` | 24px / 32px / — / 600 |
| `text-body-lg` | 18px / 28px / — / 400 |
| `text-body-md` | 16px / 24px / — / 400 |
| `text-body-sm` | 14px / 20px / — / 400 |
| `text-label-caps` | 12px / 16px / 0.08em / 700 |
| `text-mono-code` | 14px / 20px / — / 500 |

The responsive headline pattern is: `text-headline-lg-mobile md:text-headline-lg`.

### Spacing
| Token | Value | Usage |
|---|---|---|
| `gutter` | 16px | Horizontal page padding (`px-gutter`) |
| `section-gap` | 120px | Vertical space between page sections |
| `margin-mobile` | 16px | Mobile layout margin |
| `margin-desktop` | 32px | Desktop layout margin |

## Utilities in `globals.css`

- **`neon-glow`**: `box-shadow: 0 0 20px rgba(255, 1, 251, 0.15)` — subtle pink ambient glow for primary CTAs.
- **`px-gutter`**: `padding-inline: 16px` — horizontal page padding shorthand.

## Hero z-index layering

The Hero has three layers:

1. `z-0` — Three.js canvas (`absolute inset-0`)
2. `z-[1]` — Atmospheric glow blobs (`absolute inset-0`, `hidden md:block`)
3. `z-10` — Content block and scroll indicator

The glows **must not** use `-z-10` — that places them behind the canvas and makes them invisible.

## Tailwind v4 + `@config` compatibility note

The project uses Tailwind v4 (`@import 'tailwindcss'`) with `@config '../../../tailwind.config.mjs'` for v3-compatible token definitions. This works for `theme.extend` (colors, fontFamily, fontSize compound values, spacing).

**Known gotcha:** Arbitrary viewport units like `min-h-[100svh]` produce `min-height: 0px` in this setup. Use `min-h-screen` (`100vh`) instead.
