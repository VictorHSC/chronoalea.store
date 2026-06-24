#!/usr/bin/env node
// Cria um novo item rapidamente:
//   npm run new-item -- "Nome do Item" grupo
// Ex.: npm run new-item -- "Sol Ring Foil" mtg
import { mkdir, writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';

function slugify(input) {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const [, , rawTitle, rawGroup] = process.argv;
if (!rawTitle) {
  console.error('Uso: npm run new-item -- "Nome do Item" [grupo]');
  process.exit(1);
}

const slug = slugify(rawTitle);
const group = rawGroup ? slugify(rawGroup) : '';
const today = new Date().toISOString().slice(0, 10);

const mdPath = join('src', 'content', 'items', `${slug}.md`);
const photoDir = join('public', 'items', slug);

try {
  await access(mdPath);
  console.error(`✋ Já existe: ${mdPath}`);
  process.exit(1);
} catch {
  /* não existe, segue o jogo */
}

const frontmatter = `---
title: ${rawTitle}
group: ${group}
tags: []
status: available
condition:
date: ${today}
photos:
  - /items/${slug}/1.jpg
---

Descrição do item aqui.
`;

await mkdir(photoDir, { recursive: true });
await writeFile(mdPath, frontmatter, 'utf8');

console.log(`✅ Item criado: ${mdPath}`);
console.log(`📁 Coloque as fotos em: ${photoDir}/  (ex.: 1.jpg, 2.jpg)`);
console.log('   Depois edite tags/condição e dê commit.');
