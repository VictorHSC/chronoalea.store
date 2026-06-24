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
const photoDir = join('src', 'assets', 'items', slug);

try {
  await access(mdPath);
  console.error(`✋ Já existe: ${mdPath}`);
  process.exit(1);
} catch {
  /* não existe, segue o jogo */
}

// Sem campo `photos`: as fotos otimizadas são lidas de src/assets/items/<slug>/.
const frontmatter = `---
title: ${rawTitle}
group: ${group}
tags: []
status: available
condition:
date: ${today}
---

Descrição do item aqui.
`;

await mkdir(photoDir, { recursive: true });
await writeFile(mdPath, frontmatter, 'utf8');

console.log(`✅ Item criado: ${mdPath}`);
console.log(`📁 Fotos (otimizadas pelo Astro) em: ${photoDir}/`);
console.log('   • iPhone RAW/DNG/HEIC:  npm run import-raw -- ' + slug + ' foto1.DNG foto2.DNG ...');
console.log('   • já é JPG/PNG:         copie como 01-nome.jpg, 02-nome.jpg (1ª = preview)');
console.log('   A 1ª imagem (ordem alfabética) é o preview do WhatsApp.');
