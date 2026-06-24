import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// -----------------------------------------------------------------------------
// ITENS  ->  um arquivo .md por item em  src/content/items/<slug>.md
//   O nome do arquivo vira a URL:  src/content/items/black-lotus.md
//                                  ->  /item/black-lotus/
// -----------------------------------------------------------------------------
const items = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/items' }),
  schema: z.object({
    title: z.string(),
    // Grupo principal: deve ser o nome de um arquivo em src/content/groups/.
    group: z.string().optional(),
    // Tags livres para filtrar. Ex.: ["foil", "commander", "vermelho"]
    tags: z.array(z.string()).default([]),
    status: z.enum(['available', 'reserved', 'sold']).default('available'),
    // Condição (texto livre). Ex.: "NM", "usado", "lacrado".
    condition: z.string().optional(),
    // Caminhos das fotos a partir de /public. Ex.: ["/items/black-lotus/1.jpg"]
    // A primeira foto é usada no preview do WhatsApp.
    photos: z.array(z.string()).default([]),
    // Fixa o item no topo da home.
    featured: z.boolean().default(false),
    // Usado para ordenar (mais novo primeiro). Se omitido, usa a data do build.
    date: z.coerce.date().optional(),
  }),
});

// -----------------------------------------------------------------------------
// GRUPOS  ->  coleções curadas em  src/content/groups/<slug>.md
//   O nome do arquivo é o `group` referenciado pelos itens.
// -----------------------------------------------------------------------------
const groups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/groups' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    cover: z.string().optional(), // caminho de foto em /public (opcional)
    order: z.number().default(0), // ordena os grupos na navegação
  }),
});

export const collections = { items, groups };
