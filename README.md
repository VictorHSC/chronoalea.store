# Loja do Victor 🛒

Catálogo pessoal para anunciar itens à venda (cartas de Magic, peças de PC, etc.)
e mandar o link no WhatsApp. Cada item, grupo e tag tem a sua própria URL, com
preview bonito quando você cola o link em conversas.

Feito em [Astro](https://astro.build) (site estático), publicado de graça no
**GitHub Pages**. Sem preços no site — a negociação é no WhatsApp.

---

## 1. Rodar no seu computador

```sh
npm install     # só na primeira vez
npm run dev     # abre em http://localhost:4321
```

Outros comandos: `npm run build` (gera o site em `dist/`) e `npm run preview`
(testa o build antes de publicar).

---

## 2. Configurar (faça isto uma vez)

Edite **`src/config.ts`** e preencha os 3 valores marcados com `TODO`:

| Valor       | O que é                                              |
| ----------- | ---------------------------------------------------- |
| `whatsapp`  | Seu número, formato internacional só com dígitos. Ex.: `5547999999999` |
| `domain`    | Seu domínio. Ex.: `https://lojadovictor.com.br`      |
| `name`      | Nome da loja que aparece no topo e nos previews      |

Depois edite **`astro.config.mjs`** e troque o `site:` pelo **mesmo domínio**
(isso gera os links absolutos do preview do WhatsApp).

---

## 3. Adicionar um item

**Jeito rápido (script):**

```sh
npm run new-item -- "Sol Ring Foil" mtg
```

Isso cria `src/content/items/sol-ring-foil.md` e a pasta de fotos
`public/items/sol-ring-foil/`. Depois é só:

1. Colocar as fotos na pasta (`1.jpg`, `2.jpg`, …). A **primeira** vira o
   preview do WhatsApp. Use fotos de até ~1600px de largura.
2. Editar o arquivo `.md`: tags, condição, descrição.
3. Dar commit/push (pelo computador ou direto pelo site/app do GitHub no celular).

O site se atualiza sozinho em ~1 minuto.

**Campos do item** (no topo do `.md`, entre os `---`):

```yaml
title: Sol Ring (Foil)        # nome do item
group: mtg                    # nome de um arquivo em src/content/groups/
tags: [foil, commander]       # tags livres para filtrar
status: available             # available | reserved | sold
condition: NM                 # opcional, texto livre
date: 2026-06-24              # usado para ordenar (mais novo primeiro)
photos:
  - /items/sol-ring-foil/1.jpg
```

O texto **abaixo** dos `---` é a descrição (aceita Markdown: listas, negrito…).

---

## 4. Grupos e tags

- **Grupos** = coleções curadas (ex.: "Magic", "Peças de PC"). Cada grupo é um
  arquivo em `src/content/groups/<nome>.md` e tem a URL `/grupo/<nome>/`. Um item
  entra num grupo pelo campo `group`.
- **Tags** = etiquetas livres para filtrar (ex.: `foil`, `gpu`). Não precisa
  declarar: aparecem sozinhas a partir dos itens. Cada tag tem a URL
  `/tag/<tag>/`, e a home filtra por várias tags com link compartilhável
  (`/?tags=foil,commander`).

---

## 5. Publicar no GitHub Pages

1. Crie um repositório **público** no GitHub e suba este projeto.
2. No GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. Todo `push` na branch `main` publica automaticamente (workflow em
   `.github/workflows/deploy.yml`).

### Domínio próprio

O domínio usado é `store.chronoalea.com` (um **subdomínio**), já gravado em
`public/CNAME`.

1. No DNS do `chronoalea.com`, crie **um registro CNAME**:
   - **Host/Nome:** `store`
   - **Valor/Aponta para:** `SEU-USUARIO.github.io`
2. Em **Settings → Pages**, coloque `store.chronoalea.com` em "Custom domain" e
   marque **Enforce HTTPS** (pode levar alguns minutos para liberar o certificado).

> Se um dia usar o domínio raiz (apex, ex.: `chronoalea.com`), aí sim use 4
> registros **A** apontando para `185.199.108.153`, `185.199.109.153`,
> `185.199.110.153`, `185.199.111.153`.

---

## 6. Trocar as fotos de exemplo

Os itens em `src/content/items/` e as imagens `.svg` em `public/items/` são só
exemplos. Apague o que não quiser e crie os seus com `npm run new-item`.
