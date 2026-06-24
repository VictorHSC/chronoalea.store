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

It writes `src/content/items/<slug>.md` and `src/assets/items/<slug>/` (the photo
folder). Read the command output to learn the exact `<slug>` it chose.

## 3. Add the photos (optimized pipeline)
Photos for new items live in **`src/assets/items/<slug>/`** — Astro turns them
into responsive AVIF/WebP at build time, so the page loads a tiny image first and
full-res only when needed. Name them so they **sort in display order**; the first
(e.g. `01-…`) is the **WhatsApp/link preview**, so make it the best/hero shot.

- **RAW / DNG / HEIC** (e.g. iPhone ProRAW): run the importer, listing the files
  in the order you want — it develops, resizes, and numbers them:
  ```sh
  npm run import-raw -- <slug> path/to/hero.DNG path/to/two.DNG ...
  ```
- **Already JPG/PNG:** copy them in, numbered:
  `cp hero.jpg src/assets/items/<slug>/01-hero.jpg` (then `02-…`, `03-…`).
- The site reads **every image in that folder automatically** (sorted by name) —
  you do **not** list them in the frontmatter.
- If there are no photos yet, leave the folder empty and tell the user to add
  them before publishing.

> Legacy/simple path (no optimization): you may instead drop a raster in
> `public/items/<slug>/` and list it under `photos:` in the frontmatter. The two
> demo items work this way. Prefer `src/assets` for real photos.

## 4. Fill the frontmatter
Edit `src/content/items/<slug>.md`. The schema lives in `src/content.config.ts` —
match it exactly. Set `group`/`tags`/`condition`/`status` and write the
description in the body (Markdown: lists, **bold**, etc.). With the optimized
pipeline you **omit `photos:`** — images come from the `src/assets` folder.

```yaml
---
title: Ragavan, Nimble Pilferer (Foil)
group: mtg
tags: [foil, commander, vermelho]
status: available
condition: NM
date: 2026-06-24          # today; used to sort newest-first
---

Foil de MH2, pronto pro seu deck de Commander. Centralização ótima.
```

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
