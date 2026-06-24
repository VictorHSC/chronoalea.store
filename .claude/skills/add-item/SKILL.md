---
name: add-item
description: >-
  Add a new item for sale to the ChronoAlea store (Astro static site in this
  repo) and optionally publish it. Use this whenever the user wants to list,
  add, post, announce, or "sell" something — a Magic card, a PC part, or any
  product — even if they just paste a photo and a name ("sell my Sol Ring foil",
  "add this GPU", "list these cards", "põe esse item à venda"). Handles
  scaffolding the Markdown file, placing the photos, filling tags/condition/
  status, previewing, and committing so GitHub Pages redeploys.
---

# Add an item to the store

This repo is a personal "for sale" catalog (see `AGENTS.md`/`CLAUDE.md`). Each
item is a Markdown file plus photos; pushing to `main` auto-deploys. Your job is
to turn what the user gives you (a name, maybe a photo path, a few details) into
a correct item and offer to publish it. Prefer the scaffold script over writing
files by hand — it keeps slugs and folders consistent.

## 1. Gather the essentials
You need at least a **title**. Ask only for what's missing, and keep it light —
this is a one-person store. Useful fields:
- **title** (required) — e.g. "Ragavan, Nimble Pilferer (Foil)".
- **group** — which collection it belongs to. Must match a file in
  `src/content/groups/` (currently `mtg`, `pc-parts`). If the user names a new
  group, offer to create it (see §5).
- **photos** — file path(s) the user points at, or they'll add them later.
- **tags** — free-form filter labels (`foil`, `commander`, `gpu`, `nvidia`…).
- **condition** — free text (`NM`, `usado, testado`, `lacrado`…).
- **status** — `available` (default), `reserved`, or `sold`.

Don't ask about price — this store never shows prices (negotiated on WhatsApp).

## 2. Scaffold the files
Run the project's scaffolder — it creates the Markdown file and the photo folder
with a consistent slug:

```sh
npm run new-item -- "Título do Item" grupo
```

It writes `src/content/items/<slug>.md` and `public/items/<slug>/`. Read the
command output to learn the exact `<slug>` it chose (slugified title).

## 3. Place the photos
Photos go in `public/items/<slug>/`, named `1.jpg`, `2.jpg`, … The **first photo
is the WhatsApp/link preview image**, so make it the best/front shot.

- If the user gave file paths, copy them in: `cp "<src>" public/items/<slug>/1.jpg`.
- **Must be raster** (`.jpg`/`.png`) — SVG won't preview in WhatsApp. If a source
  is `.heic`/`.webp`/huge, convert/resize with macOS `sips`, e.g.
  `sips -s format jpeg -Z 1600 "<src>" --out public/items/<slug>/1.jpg`
  (`-Z 1600` caps the long edge at 1600px to keep loads fast — there's no
  build-time image optimization).
- If the user has no photos yet, leave the `photos:` entry as a placeholder and
  tell them to drop files in that folder before publishing.

## 4. Fill the frontmatter
Edit `src/content/items/<slug>.md`. The schema lives in
`src/content.config.ts` — match it exactly. Update the `photos:` list to the
real filenames, set `group`/`tags`/`condition`/`status`, and write the
description in the body (Markdown: lists, **bold**, etc.).

```yaml
---
title: Ragavan, Nimble Pilferer (Foil)
group: mtg
tags: [foil, commander, vermelho]
status: available
condition: NM
date: 2026-06-24          # today; used to sort newest-first
photos:
  - /items/ragavan-nimble-pilferer-foil/1.jpg
  - /items/ragavan-nimble-pilferer-foil/2.jpg
---

Foil de MH2, pronto pro seu deck de Commander. Centralização ótima.
```

Paths in `photos:` are absolute from `public/` (start with `/items/...`).

## 5. New group (only if needed)
If the item's group doesn't exist yet, create `src/content/groups/<slug>.md`:

```yaml
---
title: Nome do Grupo
description: Descrição curta opcional.
order: 3            # controls position in the home nav
---
```

## 6. Verify, then publish
Quick local check before publishing is worth it:

```sh
npm run build       # fails loudly if frontmatter doesn't match the schema
```

Optionally `npm run dev` and look at `/item/<slug>/`. Then commit & push — that
triggers the GitHub Pages deploy (~1 min to live):

```sh
git add -A && git commit -m "Add item: <title>" && git push
```

Always confirm with the user before pushing (it publishes publicly). If they
only want to stage it, stop after editing the files and tell them how to publish.

## Notes
- One item per Markdown file; the filename is the URL slug (`/item/<slug>/`).
- Tags need no declaration — they appear automatically as filters and get their
  own `/tag/<tag>/` pages.
- To mark something sold later: set `status: sold` and push. With `hideSold: true`
  in `src/config.ts`, it disappears from the site.
