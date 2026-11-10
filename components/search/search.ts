import { createLoader, parseAsString } from "nuqs/server";
import { getProductDetail, type ProductDetail } from "@/components/product";
import { DEMO_PRODUCT_HANDLES } from "@/components/shared/demo-products";

export const loadSearchParams = createLoader({ q: parseAsString.withDefault("") });

/** Everything a word in the search box can match: name, brand, category, colours and badge. */
function haystack(p: ProductDetail) {
  return [p.title, p.vendor, p.category.label, p.badge ?? "", ...p.colors.map((c) => c.name)].join(" ").toLowerCase();
}

/**
 * Demo search: every word must appear somewhere in the product, and title matches come first.
 * TODO: once Shopify is connected, use the Storefront API `search(query:)` instead (it also handles typos and plurals).
 */
export function searchProducts(query: string): ProductDetail[] {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!words.length) return [];

  return DEMO_PRODUCT_HANDLES.map(getProductDetail)
    .filter((p): p is ProductDetail => !!p)
    .filter((p) => {
      const text = haystack(p);
      // Treat "shirts" like "shirt" so simple plurals still match.
      return words.every((w) => text.includes(w) || (w.endsWith("s") && text.includes(w.slice(0, -1))));
    })
    .toSorted((a, b) => titleHits(b, words) - titleHits(a, words));
}

const titleHits = (p: ProductDetail, words: string[]) =>
  words.filter((w) => p.title.toLowerCase().includes(w)).length;
