# Nordic storefront

Next.js 16 storefront. Shopify is the backend (see `lib/shopify/` and `SHOPIFY-SETUP.md`).

## UI

- **Before building any UI, read `components/custom/README.md`** and reuse those components (form fields, dialogs, pagination, search, breadcrumbs…). Import them with `~/`.
- `components/ui/` holds the shadcn primitives (Radix, `new-york` style). Add more with `pnpm dlx shadcn@latest add <name>`.
- Design tokens (colours, light/dark) and the type scale (`type-hero`, `type-page-title`, `type-body`…) live in `styles/globals.css` and come from the Figma file.
- Fonts: Unbounded for headings (`font-heading`) and Geist for body text (`font-sans`), set in `lib/fonts.ts`.

## Where things live

- `app/page.tsx` only composes sections. Section components go in `components/<area>/` (`home/`, `layout/`, `collection/`), and pieces reused across areas go in `components/shared/` (`product-card`, `from-shopify`, `colors`, `section-header`, `logo`, `social-icons`).
- Product data comes from Shopify through `lib/shopify/`. `components/shared/from-shopify.ts` turns Shopify products into product cards and `components/product/from-shopify.ts` into product page data.
- Images from the Figma file are in `public/images/` (`hero/`, `products/`, `brand/`, `marketing/`), named by what they show. `FIGMA.fig` (git-ignored) is the source.
- Plain CSS rules in `styles/globals.css` must sit inside `@layer base { }`. Top-level rules are dropped by the Tailwind build. For a breakpoint inside such a rule use `@variant max-lg { … }`; a nested `@media` is dropped too.

## Checks before finishing a change

`npx tsc --noEmit` and `pnpm lint`.
