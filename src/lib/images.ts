import type { ImageMetadata } from 'astro';

// Fotos otimizadas vivem em src/assets/items/<slug>/ e são processadas pelo
// Astro (responsive AVIF/WebP). Itens antigos que usam caminhos em /public
// continuam funcionando pelo campo `photos` do frontmatter.
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/items/**/*.{jpg,jpeg,png}',
  { eager: true },
);

/** Imagens otimizadas de um item, ordenadas pelo nome do arquivo (01-, 02-…). */
export function getPhotos(slug: string): ImageMetadata[] {
  const prefix = `/src/assets/items/${slug}/`;
  return Object.entries(modules)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, mod]) => mod.default);
}
