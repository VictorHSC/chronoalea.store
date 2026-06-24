// =============================================================================
//  CONFIGURAÇÃO DO SITE  —  edite os 3 valores marcados com TODO
// =============================================================================
// Depois de preencher, o site inteiro se atualiza sozinho.

export const SITE = {
  /** Nome curto da loja (aparece no topo e nos previews do WhatsApp). */
  name: 'ChronoAlea Store',

  /** Descrição padrão (usada quando uma página não tem a sua própria). */
  description: 'Itens variados. Fale comigo no WhatsApp!',

  // TODO: troque pelo seu domínio (sem barra no final). Também precisa ser
  //       igual ao `site` em astro.config.mjs.
  domain: 'https://store.chronoalea.com',

  // TODO: seu número de WhatsApp em formato internacional, só dígitos.
  //       Ex.: Brasil DDD 47 -> 55 47 9XXXXXXXX = '5547999999999'
  whatsapp: '5548998227690',

  /** Imagem usada no preview quando o item/página não tem foto. */
  defaultImage: '/og-default.svg',

  /** Idioma do documento. */
  locale: 'pt-BR',

  /** Se true, itens marcados como "sold" somem do site. */
  hideSold: true,
} as const;

// Textos da interface, centralizados para facilitar ajustes.
export const STR = {
  available: 'Disponível',
  reserved: 'Reservado',
  sold: 'Vendido',
  allItems: 'Todos os itens',
  groups: 'Grupos',
  filterByTag: 'Filtrar por tag',
  clearFilter: 'Limpar',
  noResults: 'Nenhum item encontrado para esse filtro.',
  contactWhatsApp: 'Tenho interesse',
  shareWhatsApp: 'Compartilhar',
  condition: 'Condição',
  backHome: '← Voltar',
  tag: 'Tag',
  group: 'Grupo',
} as const;

/** Status possíveis -> rótulo em português. */
export const STATUS_LABEL: Record<'available' | 'reserved' | 'sold', string> = {
  available: STR.available,
  reserved: STR.reserved,
  sold: STR.sold,
};
