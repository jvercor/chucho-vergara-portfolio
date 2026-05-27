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
The default color palette — black background, `stone-200/300` text, `white/10` borders, subtle purple radial gradient accent. Matches the reference design.
_Avoid_: Night mode, dark mode (use Dark Theme)

**Light Theme**:
The alternative palette, toggled by the user via a sun/moon icon in the Nav. Same layout, inverted colors.
_Avoid_: Day mode, white theme

### Visual / interaction

**Hero**:
The full-screen section at the top of Home, containing the Three.js 3D scene and the identity card.
_Avoid_: Banner, splash

**3D Scene**:
The interactive Three.js scene rendered behind the identity card on the Home hero. The model auto-rotates slowly (idle rotation) and tilts toward the cursor (mouse-tracking). Replaces the earlier Spline implementation. Model served from `/public/3d/logo.glb`.
_Avoid_: Spline scene, 3D model viewer

**Identity Card**:
The frosted-glass card pinned to the bottom of the Hero showing the owner's name, title, and social links.
_Avoid_: Bio card, intro card

## Conventions

**Commit messages**: Short one-liners only. No co-authored-by trailers.

## Example dialogue
> **Domain expert**: Neither — that's not a defined section. If it's about the owner's identity, it could go on the Identity Card in the Hero. If it's a project metric, it belongs on a Project.

> **Dev**: I'm adding a "Technologies" field to Projects — is that the same as Skills?
> **Domain expert**: No. Skills are resume entries managed by the owner. Tech stack tags on a Project are metadata about that specific project. Don't conflate them.
