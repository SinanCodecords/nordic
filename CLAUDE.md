# Nordic storefront

Next.js 16 storefront. Shopify is the backend (see `lib/shopify/` and `SHOPIFY-SETUP.md`).

## UI

- **Before building any UI, read `components/custom/README.md`** and reuse those components (form fields, dialogs, pagination, search, breadcrumbs…). Import them with `~/`.
- `components/ui/` holds the shadcn primitives (Radix, `new-york` style). Add more with `pnpm dlx shadcn@latest add <name>`.
- Design tokens (colours, light/dark) and the type scale (`type-hero`, `type-page-title`, `type-body`…) live in `styles/globals.css` and come from the Figma file.
- Fonts: Unbounded for headings (`font-heading`) and Geist for body text (`font-sans`), set in `lib/fonts.ts`.

## Checks before finishing a change

`npx tsc --noEmit` and `pnpm lint`.
