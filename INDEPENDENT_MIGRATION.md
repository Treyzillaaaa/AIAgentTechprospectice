# TechProspective Independent Migration

## Decision
Replace the StarNet-derived codebase with a separately authored TechProspective application. Do **not** attempt to claim this existing fork is independent simply because files have been renamed.

## Initial independent app
A separate, from-scratch static application has been prepared outside this repository as a distributable bundle, containing:
- `index.html`, `styles.css`, `app.js`, `README.md`, `.nojekyll`
- Four DBA workspaces and 13 thematic station roles
- Planning-only assignment editor, browser-local storage, export JSON
- No StarNet imports, framework, provider keys, server dependencies or copied graphics

## Move into a standalone repository
1. Create a **new repository**, not a fork, under the TechProspective GitHub owner.
2. Upload the independent application files as the **first commit** on its own `main` branch.
3. Enable GitHub Pages from `main` / root for the static UI preview.
4. Verify all UI content works before retiring the current fork.
5. Later deploy an authenticated agent API + durable database on infrastructure under business control.
6. Never expose provider tokens, secrets, or private company records in GitHub Pages.

## Why not simply detach this fork?
GitHub has a 'Leave fork network' setting, but only eligible forks can use it and the Git history remains inherited. A genuinely clean application should start in its own fresh repository. The former fork can be archived or deleted **after** validating the migration. Its deletion is destructive and is not performed automatically.

## Important limits
- No LLM agents are running in the initial app; assignment status is planning-only.
- GitHub Pages hosts only static UI, not server-side AI execution or databases.
- If the destination will be commercial, avoid official Pokémon assets and review thematic naming rights.
