# Chucho Vergara Portfolio

A personal portfolio site for Jesus "Chucho" Vergara, Sr. Full Stack Engineer. Showcases professional work, resume information, and blog posts, built on Payload CMS + Next.js.

## Language

### Site sections

**Home**:
The landing page. Contains a hero with a Three.js 3D scene and an identity card. Surfaces Projects, including a Featured Projects block.
_Avoid_: Index, landing page

**Featured Projects**:
A Payload CMS block that lets an editor hand-pick exactly two Projects to highlight. Renders as a bento grid: first Project large (8-col, aspect-video), second Project small (4-col, aspect-square). Displays the Project's cover image, title, short description, and up to 3 Stack tags. The large card additionally shows a `git clone` row when `repoUrl` is set. The block includes a CMS-editable subtitle and a "View All Projects" link to `/projects`. Usable on any Page via the layout field.
_Avoid_: Featured works, pinned projects, highlighted projects

**Resume**:
A dedicated page displaying Experience, Education, Skills, and Languages in a traditional resume layout.
_Avoid_: CV, about

**Project**:
A portfolio piece managed as a Payload collection. Has a title, short description, cover image, Stack tags, live URL, repo URL, client location, launch date, and rich-text body. Sorted by launch date descending.
_Avoid_: Work, case study, portfolio item

**Client Location**:
A plain-text city name indicating where the client of a Project is based (e.g., "San Francisco"). Optional field on Project.
_Avoid_: Address, region, country

**Launch Date**:
The date a Project went live publicly. Used to sort Projects chronologically. Distinct from the CMS publish date.
_Avoid_: Published at, created at, completed at

**Stack**:
A technology or tool entry managed as a Payload collection. Referenced by Projects as tags. Has a title only. Enables future reuse across Resume visuals and other site sections.
_Avoid_: Technology, tag, skill (see Skill for resume entries)

**Post**:
A blog entry written by the site owner. Distinct from a Project — a Post is editorial content, not a portfolio showcase.
_Avoid_: Article, blog post

**Blog**:
The public-facing section that lists all published Posts. One of the four top-level nav destinations.
_Avoid_: Articles, news, writing

**Nav**:
The persistent top navigation bar linking to Home, Projects, Resume, and Blog.
_Avoid_: Header nav, menu, sidebar

### Resume content collections

**Experience**:
A professional history entry. Belongs to the Resume page. Has company, role, date range, and description.
_Avoid_: Job, position, work history

**Education**:
An academic history entry. Belongs to the Resume page. Has institution, degree, field of study, and year.
_Avoid_: School, degree entry

**Skill**:
A technical capability entry grouped by category (e.g., Frameworks, Tools). Belongs to the Resume page.
_Avoid_: Technology, competency

**Language**:
A spoken/human language entry with proficiency level (e.g., English — Native, Spanish — Fluent). Belongs to the Resume page.
_Avoid_: Programming language, tongue

### Theme

**Dark Theme**:
The default color palette. Background `#0a0a0a` (surface-black), text `#e2e2e2` (on-surface), accent `#ff01fb` (neon-pink), muted text `#dcbed3` (on-surface-variant). Defined via a design system token set — see ADR 0003.
_Avoid_: Night mode, dark mode (use Dark Theme)

**Light Theme**:
The alternative palette, toggled by the user via a sun/moon icon in the Nav. Same layout, inverted colors.
_Avoid_: Day mode, white theme

**Design System Tokens**:
Color, typography, and spacing tokens sourced from the `hyper_violet_engineering` template (local, gitignored). Tokens live in `tailwind.config.mjs` under `theme.extend` — colors, fontFamily, fontSize (compound values), and spacing. Font is Geist (not the template's Inter). See ADR 0003 for the full token map and architecture decisions.
_Avoid_: CSS variables, Tailwind defaults

### Visual / interaction

**Glass Card**:
A visual treatment applied to content cards using three co-operating classes: `glass-card` (backdrop-filter blur only), `border border-border/40 bg-card/80` (Tailwind border + semi-transparent background), and `neon-glow-pink` (hover box-shadow glow). Border color on hover is handled via Tailwind's `group-hover:border-neon-pink` on the card element. Always used together with `transition-all duration-500`.

`bg-card/80` (not fully opaque) is intentional — it lets the `backdrop-filter: blur(12px)` show through: dark glass in Dark Theme, frosted white/lavender in Light Theme.
_Avoid_: Frosted card, blur card

**Hero**:
The full-screen section at the top of Home. Contains a centered content block (name h1, role subtitle, tagline, CTAs, availability badge) with atmospheric glow blobs and a scroll indicator. Uses adaptive CSS-var tokens so it renders correctly in both Dark and Light Theme.
_Avoid_: Banner, splash

**3D Scene**:
Removed from the Hero. Previously a Three.js matcap-shaded GLB with mouse-tracking. May be reintroduced in a future section.
_Avoid_: Spline scene, 3D model viewer

**Identity Card**:
Removed. Previously a frosted-glass card pinned to the bottom of the Hero. Replaced by the centered Hero content block.
_Avoid_: Bio card, intro card

### Buttons

**Primary Button** (`btn-primary`):
Image-textured border via CSS mask trick (`button.jpg`). Transparent background, Geist font, `1rem 2rem` padding. Available as `<Button variant="primary" size="clear">`. Hover: `scale(1.05)` + `brightness(1.15)`. No background fill on hover.
_Avoid_: Filled button, neon-pink background button

**Hero Outline Button** (`hero-outline`):
Secondary CTA. `border-border` border, transparent background, `text-foreground` text. Hover: fills with `bg-foreground`, flips text to `text-background`, border becomes transparent. Inverts correctly in both themes. Available as `<Button variant="hero-outline" size="clear">`.
_Avoid_: Ghost button, secondary button

**Solid Button** (`btn-solid`):
Always-white filled CTA. `bg-white text-black`, theme-independent. Available as `<Button variant="solid" size="clear">`. Hover: `scale(1.05)` + `brightness(1.05)`. Also selectable in Payload CMS link fields as appearance `"solid"`.
_Avoid_: Filled button, white button



**Commit messages**: Short one-liners only. No co-authored-by trailers.

## Example dialogue
> **Domain expert**: Neither — that's not a defined section. If it's about the owner's identity, it could go on the Identity Card in the Hero. If it's a project metric, it belongs on a Project.

> **Dev**: I'm adding a "Technologies" field to Projects — is that the same as Skills?
> **Domain expert**: No. Skills are resume entries managed by the owner. Tech stack tags on a Project are metadata about that specific project. Don't conflate them.
