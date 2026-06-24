// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Precisa ser igual a SITE.domain em src/config.ts.
  // É usado para gerar URLs absolutas (canonical + preview do WhatsApp).
  site: 'https://store.chronoalea.com',

  // Domínio próprio (apex) serve a partir da raiz, então base permanece '/'.
  base: '/',

  // URLs com barra no final: /item/black-lotus/
  trailingSlash: 'always',
});
