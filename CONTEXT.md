# Chucho Vergara Portfolio

A personal portfolio site for Jesus "Chucho" Vergara, Sr. Full Stack Engineer. Showcases professional work, resume information, and blog posts, built on Payload CMS + Next.js.

## Language

### Site sections

**Home**:
The landing page. Contains a hero with a Three.js 3D scene and an identity card. Surfaces Projects, including a Featured Projects block.
_Avoid_: Index, landing page

**Projects Page**:
A fixed hardcoded route at `/projects`. Layout: short text hero (h1 + tagline), a bento grid of the two most-recently-launched published Projects (large 8-col + small 4-col), then all remaining published Projects in a 3-per-row small-card grid. Projects are sorted by Launch Date descending. Card components are shared via `src/components/ProjectCards`. SEO metadata and optional trailing CMS blocks (e.g. CTA) are supplied by a companion `Pages` collection document with slug `projects`. If no such document exists the page falls back to a hardcoded title.
_Avoid_: Project list, project archive, all projects

**Featured Projects**:
A Payload CMS block that lets an editor hand-pick exactly two Projects to highlight. Renders as a bento grid: first Project large (8-col, aspect-video), second Project small (4-col, aspect-square). Displays the Project's cover image, title, short description, and up to 3 Stack tags. The large card additionally shows a `git clone` row when `repoUrl` is set. The block includes a CMS-editable subtitle and a "View All Projects" link to `/projects`. Usable on any Page via the layout field.
_Avoid_: Featured works, pinned projects, highlighted projects

**Resume**:
A dedicated page displaying Experience, Education, Skills, and Languages in a traditional resume layout.
_Avoid_: CV, about

**About Page**:
A fixed hardcoded route at `/about`. Layout: a Terminal Hero, followed by the Journey Phases timeline. SEO metadata and optional trailing CMS blocks are supplied by a companion `Pages` collection document with slug `about`, following the same companion-doc pattern as the Resume and Projects pages (see ADR 0002).
_Avoid_: Bio page, profile page

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
A technology or tool entry managed as a Payload collection. Referenced by Projects as tags and by Experience entries as related tech. Fields: title, optional subtitle (most relevant for Frameworks, e.g. "Fullstack"), and category (one of: programming-language, framework, infrastructure, database). The category field determines which column of the Technical Stack section the item appears in.
_Avoid_: Technology, tag, skill

**Programming Language**:
A Stack entry with category `programming-language` (e.g., TypeScript, Rust, Go, Python). Displayed in the "Languages" column of the Technical Stack section on the Resume page.
_Avoid_: Language (that term is reserved for spoken/human languages)

**Technical Stack**:
The Resume page section that aggregates all Stack items referenced by Experience entries and Journey Phases, grouped by their category into four columns: Programming Languages, Frameworks & Libs, Infrastructure, Databases. Items are de-duplicated across both sources and ordered by recency — items from the most recent entry (highest start year, across Experience and Journey Phases combined) appear first within each category column.
_Avoid_: Skills section, tech grid, technology list

**Post**:
A blog entry written by the site owner. Distinct from a Project — a Post is editorial content, not a portfolio showcase.
_Avoid_: Article, blog post

**Blog**:
The public-facing section that lists all published Posts. One of the four top-level nav destinations.
_Avoid_: Articles, news, writing

**Nav**:
The persistent top navigation bar linking to Home, Projects, Resume, and Blog. On desktop (≥768px), displays as a horizontal row of links. On mobile and tablet (<768px), collapses to a Nav Toggle button that opens the Nav Drawer. Active link indicated with `text-neon-pink`.
_Avoid_: Header nav, menu, sidebar

**Nav Toggle**:
The hamburger menu button (24px icon in 40x40px tap target) that appears on mobile/tablet (<768px). Animates from three horizontal lines to an X when the Nav Drawer is open. Uses `text-foreground` with `hover:text-neon-pink`. Built with three `<span>` elements and CSS transforms.
_Avoid_: Menu button, burger button, hamburger icon

**Nav Drawer**:
The mobile/tablet navigation overlay that slides in from the right when the Nav Toggle is tapped. 85vw wide, uses `bg-background/90 backdrop-blur-sm` (same treatment as scrolled Header), z-50. Contains nav links vertically stacked as large centered touch targets. Slides in/out with 300ms transition. Closes via: X button, backdrop tap, any nav link tap, or Escape key. Enforces focus trap and scroll lock while open.
_Avoid_: Mobile menu, side drawer, navigation panel

**Backdrop**:
The semi-transparent overlay (`bg-black/50 backdrop-blur-sm`, z-40) that appears behind the Nav Drawer when open on mobile. Tapping it closes the drawer. Locks body scroll while visible.
_Avoid_: Overlay, modal background, scrim

### Resume content collections

**Experience**:
A professional history entry managed as a Payload collection. Fields: company name, optional company URL, role/job title, start year, end year (optional), isCurrent boolean (renders end year as "Present"), and rich-text bullet points (Lexical, inline formatting allowed). Also carries a has-many relationship to Stack items (the tech used in that role). Displayed sorted by start year descending.
_Avoid_: Job, position, work history

**Education**:
An academic history entry managed as a Payload collection. Fields: title (degree name, e.g. "M.S. Computer Science"), institution, yearFrom, yearTo, isCurrent boolean (for currently enrolled, renders yearTo as "Present"). Ordered by admin-defined sort in Payload.
_Avoid_: School, degree entry

**Certification**:
A credential or professional certificate managed as a Payload collection. Fields: title, institution, optional note (e.g. "Professional Level"). Ordered by admin-defined sort in Payload.
_Avoid_: Certificate, award, badge

**Language**:
A spoken/human language entry with proficiency level. Belongs to the Resume page. Level is a fixed select: Native, Fluent, Advanced, Intermediate, Basic. Ordered by admin-defined sort in Payload.
_Avoid_: Programming language, tongue

### About page content

**Journey Phases**:
A narrative-chapter entry managed as a Payload collection, displayed as a timeline on the About page. Fields: title (the phase's name, e.g. "The Discovery"), location (free text, e.g. "France • Israel"), start year, end year (optional), isCurrent boolean (renders end year as "Present"; a phase with matching start/end year renders as a single year, not a range), a single rich-text description paragraph (inline formatting allowed), and a has-many relationship to Stack items (the tech/skills picked up during that phase). Displayed sorted by start year ascending (oldest phase first) — distinct from Experience, which sorts most-recent-first. Journey Phases' Stack items also feed the Technical Stack aggregation on the Resume page.
_Avoid_: Life chapters, milestones, timeline entries

### Theme

**Dark Theme**:
The default color palette. Background `#0a0a0a` (surface-black), text `#e2e2e2` (on-surface), accent `#ff01fb` (neon-pink), muted text `#dcbed3` (on-surface-variant). Defined via a design system token set — see ADR 0003.
_Avoid_: Night mode, dark mode (use Dark Theme)

**Light Theme**:
The alternative palette, toggled by the user via a `btn-solid` icon button (sun/moon) in the Footer. Same layout, inverted colors.
_Avoid_: Day mode, white theme

**Design System Tokens**:
Color, typography, and spacing tokens sourced from the `hyper_violet_engineering` template (local, gitignored). Tokens live in `tailwind.config.mjs` under `theme.extend` — colors, fontFamily, fontSize (compound values), and spacing. Fonts: Geist Sans ExtraBold (800) for headings, Inter for body text, Geist Mono for code. See ADR 0003 for the full token map and architecture decisions.
_Avoid_: CSS variables, Tailwind defaults

### Blocks

**Logo Wall**:
A CMS-controlled block that displays a horizontal row of technology or brand logos. Each entry has a label and an inline SVG (raw markup, pasted by the editor). SVGs are provided as gray-filled assets. At rest they render gray; on hover they turn white in Dark Theme and black in Light Theme via CSS filter (`brightness(0) invert(1)` / `brightness(0)`). Usable on any Page via the layout field. Generic — not restricted to tech stack; can showcase clients, partners, or tools.
_Avoid_: FavoriteStack, StackShowcase, tech logos section

**Travel Globe**:
A CMS-controlled block for the About page showing a rotating COBE-rendered globe with a photo Glass Card floating over each visited country marker as it faces the viewer, fading in/out with rotation. Two-column layout: `heading` (text) + `body` (richText) on the left, globe on the right; stacks text-above/globe-below on mobile. Editors add rows of `{ country, photo }` — country is picked from a fixed list with bundled lat/lng coordinates, not typed manually. Auto-rotates continuously; not draggable. No arcs — represents visited countries, not routes between them. Placed as a trailing block (via the companion `Pages` doc's layout field) after the Journey Timeline. Distinct from Journey Phases (career/life chapters) and Client Location (Project metadata) — this is personal travel/tourism history only.
_Avoid_: World map, travel map, photo globe

### Visual / interaction

**Glass Card**:
A visual treatment applied to content cards using three co-operating classes: `glass-card` (backdrop-filter blur only), `border border-border/40 bg-card/80` (Tailwind border + semi-transparent background), and `neon-glow-pink` (hover box-shadow glow). Border color on hover is handled via Tailwind's `group-hover:border-neon-pink` on the card element. Always used together with `transition-all duration-500`.

`bg-card/80` (not fully opaque) is intentional — it lets the `backdrop-filter: blur(12px)` show through: dark glass in Dark Theme, frosted white/lavender in Light Theme. Text inside Glass Cards must use adaptive tokens (`text-foreground`, `text-muted-foreground`) — not `text-white`.
_Avoid_: Frosted card, blur card

**Narrative Card**:
A rendered segment of a Project's rich-text body content. When a `content` field contains an `h2` heading node, that heading and its following paragraph nodes are wrapped in a Glass Card. Each `h2` opens a new Narrative Card. Non-heading and non-paragraph nodes (blocks, h3/h4, horizontal rules, leading paragraphs) render outside any card as passthrough content.
_Avoid_: Section card, content card

**Terminal Hero**:
The CMS-controlled hero used at the top of the About page. Desktop layout: 50/50 split — text content on the left and a terminal code panel on the right (background image with a floating terminal window on top, showing CMS-editable code/ASCII art). Mobile: stacked, terminal panel below text. Distinct from Model Hero (Home's hero) — intentionally less visually dominant, since the About page is about the person, not a showcase. Left side is deliberately minimal: no availability badge, no CTA links, no name/role byline (identity is established elsewhere on the page/site). Fields: `heading` (text — an About-specific framing statement, not the person's name), `tagline` (text — a single supporting sentence elaborating the heading), `backgroundImage` (media), `heroCode` (code snippet), `heroCodeFilename` (terminal window title). The terminal panel is always present.
_Avoid_: Banner, splash, Home Hero

**Medium Impact Hero**:
A CMS-controlled hero variant for interior pages (e.g. Projects, Resume). Two-column layout on desktop: rich text (H1 + body paragraph) on the left, an optional download button on the right. Fields: `richText` (Lexical — editor writes H1 as the title and a paragraph as the tagline), `downloadFile` (Payload media upload, optional), and `downloadLabel` (text for the download button, optional). No image, no badge, no highlight word. Desktop alignment is `items-end` — the download button anchors to the bottom of the left text block.
_Avoid_: Banner hero, section header



**Model Viewer**:
A responsive Three.js canvas component that fills its parent container. Loads `model.glb` with a matcap shader and tracks mouse movement to rotate the model. Distinct from `Logo3D` (which is fixed-px, square, for nav icon use). Model Viewer measures its container via `ResizeObserver` and feeds the renderer the real pixel dimensions. Used as the right panel of the Model Hero.
_Avoid_: Logo3D, 3D canvas

**Model Hero**:
A full-screen hero variant for the Home page. The Model Viewer fills the entire hero as a full-bleed canvas; text content (`badge`, `heading`, `tagline`, `links`) is absolutely positioned as a left-aligned overlay on top of the canvas. The model is dynamically panned rightward on wide aspect ratios so text and model remain visually separated without a hard layout boundary. Pulls under the header (same `-mt` treatment as High Impact Hero). The background image is a PNG/webp with baked-in transparency used as a texture overlay on top of `bg-background` — the site's dark surface shows through. No code-level opacity is applied. Desktop and mobile each have their own CMS background image field (`backgroundImage`, `mobileBackgroundImage`) to allow separate optimized assets. The hero does not force a header theme — the nav adapts to the user's active theme.
_Avoid_: 3D hero, split hero

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
