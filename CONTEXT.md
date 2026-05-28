# Chucho Vergara Portfolio

A personal portfolio site for Jesus "Chucho" Vergara, Sr. Full Stack Engineer. Showcases professional work, resume information, and blog posts, built on Payload CMS + Next.js.

## Language

### Site sections

**Home**:
The landing page. Contains a hero with a Three.js 3D scene and an identity card. Surfaces featured Projects.
_Avoid_: Index, landing page

**Resume**:
A dedicated page displaying Experience, Education, Skills, and Languages in a traditional resume layout.
_Avoid_: CV, about

**Project**:
A portfolio piece managed as a Payload collection. Has a title, short description, cover image, tech stack tags, live URL, repo URL, featured flag, and rich-text body.
_Avoid_: Work, case study, portfolio item

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

**Hero**:
The full-screen section at the top of Home. Contains a centered content block (name h1, role h2 with decorative lines, tagline, CTAs) layered above the 3D scene. Background has two atmospheric glow blobs (desktop only). A scroll indicator sits at the absolute bottom. The content block is offset downward with `mt-24 md:mt-44` to give the 3D model visual breathing room in the upper viewport.
_Avoid_: Banner, splash

**3D Scene**:
The interactive Three.js scene rendered behind the Hero content block. The model is a matcap-shaded GLB, normalized to scale `1.38`. It tilts toward the cursor (mouse-tracking via lerp) and has no idle auto-rotation. Model served from `/public/model.glb`, matcap texture from `/public/matcap.png`.
_Avoid_: Spline scene, 3D model viewer

**Identity Card**:
Removed. Previously a frosted-glass card pinned to the bottom of the Hero. Replaced by the centered Hero content block.
_Avoid_: Bio card, intro card

## Conventions

**Commit messages**: Short one-liners only. No co-authored-by trailers.

## Example dialogue
> **Domain expert**: Neither — that's not a defined section. If it's about the owner's identity, it could go on the Identity Card in the Hero. If it's a project metric, it belongs on a Project.

> **Dev**: I'm adding a "Technologies" field to Projects — is that the same as Skills?
> **Domain expert**: No. Skills are resume entries managed by the owner. Tech stack tags on a Project are metadata about that specific project. Don't conflate them.
