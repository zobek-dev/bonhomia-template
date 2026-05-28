# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Shopify theme based on Dawn, customized for the `demo-de-patagonia` store (theme id `147433029734`, environment `development` defined in `shopify.theme.toml`). Standard Shopify theme layout: `layout/`, `sections/`, `snippets/`, `templates/`, `assets/`, `config/`, `locales/`.

## Commands

- `npm run dev` — `npx mix watch`. Rebuilds `assets/main.js` and `assets/main.css` from `src/` via Laravel Mix + Tailwind/PostCSS on every change. Does **not** sync to Shopify.
- `npm run watch` — `shopify theme dev -e development`. Boots Shopify CLI dev server against the `development` environment and hot-reloads Liquid/assets to the store.
- `npm run start` — runs both concurrently. Use this for normal development.
- `npm run pull` / `npm run push` — pull/push theme files from/to the `development` environment.
- `shopify theme check` — lint Liquid (config in `.theme-check.yml`; `MatchingTranslations` and `TemplateLength` are disabled).

There is no test suite.

## Build pipeline

`webpack.mix.js` compiles **only** two entrypoints:
- `src/js/main.js` → `assets/main.js`
- `src/css/main.css` → `assets/main.css` (Tailwind)

`src/js/main.js` imports Alpine.js and Swiper (with `Navigation`, `Pagination`, `Thumbs`, `FreeMode`, `Autoplay` modules) and exposes them on `window` so Liquid templates can use them inline. Alpine is started in this file — any new Alpine plugin must be registered **before** `Alpine.start()`.

Tailwind (`tailwind.config.js`) scans Liquid in `layout/`, `sections/`, `snippets/`, `templates/`, `blocks/`, plus `assets/*.liquid|*.js`, `config/*.json`, and `templates/**/*.json`. New Liquid directories must be added to `content` or their classes will be purged. Uses `tailwindcss-rem-to-px` and `@tailwindcss/typography` with a heavily customized `typography` config — prefer extending it over inline prose overrides.

`mix-manifest.json` is generated; don't hand-edit.

## Working with the theme

- **Tailwind classes must be written with the `tw-` prefix** (e.g. `tw-flex tw-items-center tw-text-lg`). `prefix: 'tw-'` is enabled in `tailwind.config.js` — a class without the prefix simply won't be emitted. This is the project convention to avoid collisions with Dawn's existing CSS and theme-editor-injected classes. The stock Dawn sections currently ship with their own inline CSS and use **zero** Tailwind classes, so the prefix didn't require any migration; all new Bonhomia work goes through Tailwind with `tw-`.
- Liquid is formatted by Prettier with `singleQuote: false` (override in `.prettierrc.json`); JS/CSS uses single quotes, no semicolons, 2-space indent, 80 col.
- The `assets/` directory contains both compiled output (`main.js`, `main.css`) and theme assets committed directly (images, vendor files, theme-editor-uploaded assets). Do **not** delete unknown files in `assets/` — many are referenced only from settings JSON or the theme editor.
- `shopify.theme.toml` contains the store password and CLI token for the dev environment. Treat it as sensitive; don't commit changes that expose new credentials.

## Metafields Bonhomia

The theme reads custom metafields under the `bonhomia` namespace to drive Bonhomia-specific UI (assisted PDP, badges, materials, lead times). These must be created in **Shopify Admin → Settings → Custom data → Products** before they will surface in the storefront. Without them the UI falls back gracefully (no badge, no chips, etc.), but the assisted PDP is significantly emptier.

Product metafields (`product.metafields.bonhomia.*`):

| Key | Type | Used by | Notes |
|---|---|---|---|
| `purchase_type` | `single_line_text_field` | (semantic only — template assignment) | Values: `direct` \| `assisted`. The actual switch between PDPs is done by assigning `templates/product.asistido.json` to the product from the Admin product editor (Theme template selector). This field is for the upcoming app-connector to know which template to apply automatically. |
| `starting_price` | `money` | Assisted PDP quote panel | "Precio referencial desde". Rendered via the `money` filter. |
| `materials_available` | `list.single_line_text_field` | Assisted PDP quote panel | Chips ("Maderas disponibles"). |
| `lead_time_weeks` | `number_integer` | Assisted PDP badge | Displayed as "Fabricación a pedido · N semanas". An optional second metafield could be a range pair (`min`/`max`) — for now a single integer. |
| `highlights` | `multi_line_text_field` or `rich_text_field` | Direct + Assisted PDP | Rendered as `<ul>` inside `.product__highlights`. Already consumed by `sections/main-product.liquid` (highlights block) and `snippets/bonhomia-quote-panel.liquid`. |

Shop-level metafield (optional, falls back to `settings.whatsapp_number`):

| Key | Type | Used by |
|---|---|---|
| `shop.metafields.bonhomia.whatsapp` | `single_line_text_field` | WhatsApp CTA in quote panel (`wa.me/<digits>?text=...`). |

### Assigning the assisted template

In the Shopify Admin product editor, scroll to **Theme template** in the right sidebar and select `product.asistido`. That makes the product render via `templates/product.asistido.json` → `sections/main-product-asistido.liquid`, which exposes the quote form instead of the buy buttons. The native `main-product.liquid` (direct purchase) is **not** affected.

## Sections Bonhomia

Sections nuevas creadas para el storefront Bonhomia (todas en `sections/`, prefijo `bonhomia-` excepto la PDP asistida):

| Section | Propósito |
|---|---|
| `bonhomia-hero.liquid` | Hero principal (home, página A medida): imagen full-bleed con overlay, título serif, subtítulo y CTAs. Imagen `loading: eager` + `fetchpriority: high` para LCP. |
| `bonhomia-intro-strip.liquid` | Tira de texto introductorio (eyebrow + headline + párrafo) sobre fondo cream. Usada como bloque tipográfico de respiro entre secciones. |
| `bonhomia-modes-grid.liquid` | Grid de dos tarjetas grandes que presentan los dos modos de compra (directa vs. asistida). Cada tarjeta lleva imagen, copy y CTA a colección/landing. |
| `bonhomia-process-steps.liquid` | Pasos numerados del proceso de compra a medida (1 → N) con título corto y descripción. Usada en página A medida y home. |
| `bonhomia-quote-cta.liquid` | Bloque de cita editorial (frase grande con autor) + CTA secundaria. Refuerzo de marca / testimonio. |
| `bonhomia-assisted-banner.liquid` | Banner promocional del modo asistido (aparece dentro de colecciones / home) con CTA a `/pages/a-medida` o a producto asistido. |
| `main-product-asistido.liquid` | PDP alternativa para productos a medida. **No** renderiza buy buttons: monta el panel de cotización (`snippets/bonhomia-quote-panel.liquid`) que postea al backend vía `settings.assisted_api_url` + fallback WhatsApp. Se selecciona asignando `product.asistido` desde el Admin. |

## Templates Bonhomia

Templates JSON nuevos en `templates/`:

| Template | Cuándo asignarlo desde el Admin |
|---|---|
| `product.asistido.json` | Productos del catálogo "a medida" / compra asistida. Selector **Theme template** del producto → `product.asistido`. Esto reemplaza el PDP directo por el formulario de cotización. |
| `page.nosotros.json` | Página estática "Nosotros" / historia de marca. Crear la página en Admin → Pages y asignarle template `page.nosotros`. |
| `page.a-medida.json` | Landing de la propuesta "A medida" (explica el proceso, modos, CTA a producto asistido). Asignar a la página `/pages/a-medida` con template `page.a-medida`. |

## Settings globales Bonhomia

Definidos en `config/settings_schema.json`, accesibles vía `settings.*` en Liquid:

| Setting | Tipo | Uso |
|---|---|---|
| `assisted_api_url` | url / text | Endpoint del backend al que el panel de cotización (`bonhomia-quote-panel.liquid`) hace `POST` con el JSON del formulario asistido. Vacío = el form cae al fallback WhatsApp. |
| `whatsapp_number` | text | Número (con código país, sólo dígitos) usado para construir `https://wa.me/<digits>?text=...` como fallback / CTA secundaria del PDP asistido. Puede sobreescribirse por `shop.metafields.bonhomia.whatsapp`. |

Los font pickers (`type_header_font`, `type_body_font`) se reutilizan de Dawn — no se duplican settings. Las fuentes objetivo son Playfair Display (header) e Inter (body), pero el control queda en el theme editor.

## Decisiones de diseño

- **Re-skin de Dawn (header, footer, cart, PDP directa) usa `<style>` scoped por section, no utilities `tw-`.** Decisión pragmática: esas sections traen hooks JS de Dawn (cart-drawer, predictive-search, sticky-header, variant-picker) acoplados a sus clases originales. Reemplazarlas por utilities `tw-` rompería el JS upstream. Entonces se mantiene el markup Dawn y se override visual con CSS scoped al inicio de cada section (`{% style %}` o `<style>` con selectores anclados a la section).
- **Las sections nuevas (`bonhomia-*` + `main-product-asistido`) sí usan utilities `tw-` directamente.** No tienen herencia Dawn que respetar, son markup limpio.
- **Tailwind con prefix `tw-`** en lugar de migrar Dawn entero: el costo de purgar la CSS legacy de Dawn no se justifica para este alcance; convivimos.
- **Compra asistida no usa el checkout de Shopify.** El form de `main-product-asistido` postea al backend externo (`assisted_api_url`). Esto es una restricción de producto, no una limitación técnica — mantenerla aunque sea más simple usar `cart/add`.
