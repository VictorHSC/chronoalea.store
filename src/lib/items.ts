import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../config';

export type Item = CollectionEntry<'items'>;
export type Group = CollectionEntry<'groups'>;

/** Transforma um texto em slug seguro para URL (sem acentos, espaços etc.). */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos combinados
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function itemTime(item: Item): number {
  return item.data.date ? item.data.date.getTime() : 0;
}

/** Todos os itens visíveis, já ordenados (fixados primeiro, depois mais novos). */
export async function getAllItems(): Promise<Item[]> {
  const items = await getCollection('items');
  return items
    .filter((i) => !(SITE.hideSold && i.data.status === 'sold'))
    .sort((a, b) => {
      if (a.data.featured !== b.data.featured) return a.data.featured ? -1 : 1;
      return itemTime(b) - itemTime(a);
    });
}

/** Todos os grupos, ordenados por `order` e depois título. */
export async function getAllGroups(): Promise<Group[]> {
  const groups = await getCollection('groups');
  return groups.sort(
    (a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title),
  );
}

export type TagInfo = { tag: string; slug: string; count: number };

/** Lista única de tags (com contagem) a partir de uma lista de itens. */
export function collectTags(items: Item[]): TagInfo[] {
  const bySlug = new Map<string, TagInfo>();
  for (const item of items) {
    for (const tag of item.data.tags) {
      const slug = slugify(tag);
      if (!slug) continue;
      const existing = bySlug.get(slug);
      if (existing) existing.count += 1;
      else bySlug.set(slug, { tag, slug, count: 1 });
    }
  }
  return [...bySlug.values()].sort(
    (a, b) => b.count - a.count || a.tag.localeCompare(b.tag),
  );
}

export const itemUrl = (item: Item) => `/item/${item.id}/`;
export const tagUrl = (slug: string) => `/tag/${slug}/`;
export const groupUrl = (id: string) => `/grupo/${id}/`;

/** Primeira foto do item, ou undefined. */
export const cover = (item: Item): string | undefined => item.data.photos[0];

/** true se o item tem alguma tag cujo slug bate com `slug`. */
export const itemHasTagSlug = (item: Item, slug: string) =>
  item.data.tags.some((t) => slugify(t) === slug);
