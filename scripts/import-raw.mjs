#!/usr/bin/env node
// Develop/normalize source photos (RAW .DNG/ProRAW, .HEIC, .jpg, .png) into
// optimized-ready JPEGs. Astro then turns these into responsive AVIF/WebP at
// build time, so the site loads a small image first and full-res only when
// needed.
//
//   node scripts/import-raw.mjs <slug> <file1> [file2 ...]
//   npm run import-raw -- gatewatch raw/five.DNG raw/ajani.DNG ...
//
// Files are numbered in the order given (first = hero / WhatsApp preview).
// Output: src/assets/items/<slug>/NN-<name>.jpg  (long edge capped at 2400px).
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const [slug, ...files] = process.argv.slice(2);
if (!slug || files.length === 0) {
  console.error('Uso: node scripts/import-raw.mjs <slug> <arquivo1> [arquivo2 ...]');
  process.exit(1);
}

const MAX_EDGE = 2400; // px — bastante nitidez para exibir até 1600px + zoom leve
const QUALITY = 85;
const outDir = join('src', 'assets', 'items', slug);
mkdirSync(outDir, { recursive: true });

files.forEach((file, i) => {
  if (!existsSync(file)) {
    console.error(`✋ não encontrei: ${file}`);
    process.exit(1);
  }
  const name = basename(file, extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const n = String(i + 1).padStart(2, '0');
  const out = join(outDir, `${n}-${name}.jpg`);
  // sips revela o DNG e aplica orientação; -Z redimensiona mantendo proporção.
  execFileSync(
    'sips',
    ['-s', 'format', 'jpeg', '-s', 'formatOptions', String(QUALITY),
     '-Z', String(MAX_EDGE), file, '--out', out],
    { stdio: 'ignore' },
  );
  console.log(`✅ ${out}`);
});

console.log(
  `\n${files.length} foto(s) em ${outDir}/\n` +
    'Rode "npm run build" (ou dev) para gerar as versões otimizadas.',
);
