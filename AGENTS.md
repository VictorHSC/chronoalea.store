# ChronoAlea Store — project guide

Guidance for Claude Code / AI agents (and humans) working in this repo.
`CLAUDE.md` is a symlink to this file.

## What this is
A personal **"for sale" catalog / announce board** — Victor lists Magic: The
Gathering cards, PC parts, and misc items, then shares the link in WhatsApp/MTG
groups. It is **not** a transactional store: no checkout, **no prices shown**
(price is negotiated in WhatsApp). The whole point is **rich link previews**: a
pasted item URL must show the photo + name card in chat apps, which is why this
is a pre-rendered static site with per-page Open Graph tags.

**Live:** https://store.chronoalea.com · **Repo:** VictorHSC/chronoalea.store (public)

## Stack & key decisions
- **Astro v7** static site (SSG). TypeScript, no UI framework.
- **Content Collections** (Content Layer API, `glob` loader) — items & groups are
  Markdown files validated by a Zod schema in `src/content.config.ts`.
- **Plain mobile-first CSS** with variables + dark mode — `src/styles/global.css`.
- **Photos live in `public/`** (not `src/assets`) and are referenced by absolute
  path (e.g. `/items/black-lotus/1.jpg`). Chosen for dead-simple manual editing
  and reliable absolute OG image URLs. Trade-off: no build-time optimization, so
  keep photos ≲1600px. The first photo is the WhatsApp preview image.
- **Language:** Brazilian Portuguese (UI strings centralized in `src/config.ts`).
- **Contact:** WhatsApp only — a pre-filled `wa.me` link including the item title
  and its canonical URL.
- **`hideSold: true`** in config → items with `status: sold` are removed from the
  site (not shown with a badge).

## Commands
```sh
npm run dev        # dev server at localhost:4321
npm run build      # static build to dist/
npm run preview    # serve the build locally
npm run new-item -- "Nome do Item" grupo   # scaffold a new item (see below)
```
Astro also supports `astro dev --background` (manage with `astro dev stop|status|logs`).

## Project structure
```
src/
  config.ts            # SITE settings (name, domain, whatsapp, hideSold) + STR (UI text)
  content.config.ts    # Zod schema for items + groups (the source of truth for fields)
  lib/items.ts         # helpers: getAllItems, getAllGroups, collectTags, slugify, *Url
  layouts/Base.astro   # HTML shell + <head> Open Graph/canonical meta
  components/           # ItemCard, Gallery, WhatsAppButton, StatusBadge
  pages/
    index.astro        # home: groups nav + tag filter + grid (+ client filter script)
    item/[slug].astro  # item page (gallery, WhatsApp button, OG tags)
    grupo/[slug].astro # one group's items
    tag/[slug].astro   # all items with a tag
    404.astro
  content/
    items/<slug>.md    # one file per item (filename = URL slug)
    groups/<slug>.md   # curated groups (filename = the `group` value items reference)
public/
  items/<slug>/*       # photos, referenced by absolute path in item frontmatter
  CNAME                # store.chronoalea.com (custom domain)
  og-default.svg       # fallback preview image
.github/workflows/deploy.yml   # build + deploy to GitHub Pages on push to main
scripts/new-item.mjs           # the `npm run new-item` scaffolder
```

## Content model
**Item** frontmatter (schema in `src/content.config.ts`):
`title` (req), `group` (slug of a file in `content/groups/`), `tags` (string[]),
`status` (`available`|`reserved`|`sold`), `condition` (free text), `photos`
(absolute paths under `/`), `featured` (bool, pins to top), `date` (sort key,
newest first). The Markdown **body** is the description.

**Group** frontmatter: `title`, `description?`, `cover?`, `order` (sort).

## URL structure
`/` home · `/item/<slug>/` · `/grupo/<slug>/` · `/tag/<slug>/`. The home tag
filter also encodes selections in the query string (`/?tags=foil,commander`,
AND semantics) so any filter combo is shareable. Tag slugs come from `slugify()`
in `src/lib/items.ts` (strips accents → kebab-case).

## Adding an item
Use the **`/add-item` skill** (`.claude/skills/add-item/`) or do it by hand:
1. `npm run new-item -- "Título" grupo` → creates `src/content/items/<slug>.md`
   and `public/items/<slug>/`.
2. Put **real `.jpg`/`.png`** photos in that folder (first = preview). Not SVG.
3. Edit the frontmatter (tags, condition, status) and the body (description).
4. Commit & push to `main` → GitHub Actions rebuilds & redeploys (~1 min).

## Deployment
- GitHub Pages, **Actions source** (not a `gh-pages` branch). Workflow:
  `.github/workflows/deploy.yml`. Pushing to `main` publishes.
- Custom domain `store.chronoalea.com` is set in **Pages settings** (API `cname`),
  not derived from the artifact's CNAME file — Actions-based deploys store the
  domain in settings. `https_enforced` is on (cert provisioned).
- DNS: a `store` CNAME → `victorhsc.github.io`.

## Gotchas
- **Two places need the domain:** `SITE.domain` in `src/config.ts` **and** `site`
  in `astro.config.mjs`. Keep them identical — they drive absolute OG/canonical URLs.
- **`base: '/'`** because of the custom domain serving from root. The `*.github.io`
  project URL would look unstyled; always test at the custom domain.
- **OG/preview images must be raster** (`.jpg`/`.png`) to render in WhatsApp; the
  demo `.svg` placeholders won't preview in chats.
- Node is required (installed via Homebrew during setup). Astro v7 needs Node ≥22.

## Astro docs
Full docs: https://docs.astro.build — most relevant here:
[content collections](https://docs.astro.build/en/guides/content-collections/),
[routing](https://docs.astro.build/en/guides/routing/),
[components](https://docs.astro.build/en/basics/astro-components/).
