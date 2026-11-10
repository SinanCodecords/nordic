import type { Money, Product, ShopifyProduct } from "./types";

export function formatPrice({ amount, currencyCode }: Money) {
  // Currency comes from Shopify; change the locale to match the store's market.
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(Number(amount));
}

export function discountPercent(price: Money, compareAt: Money | null) {
  if (!compareAt) return 0;
  const p = Number(price.amount);
  const c = Number(compareAt.amount);
  return c > p ? Math.round(((c - p) / c) * 100) : 0;
}

// Product tags that act as shop categories; other tags are badges.
// TODO: fill in with Nordic's category tags once products are in Shopify.
export const CATEGORY_TAGS: string[] = [];

export function getCategory(tags: string[], fallback: string) {
  return tags.find((t) => CATEGORY_TAGS.includes(t)) ?? fallback;
}

// The first sentence of the description, used as the product card subtitle.
export function getSubtitle(description: string) {
  return description.split(". ")[0].replace(/\.$/, "");
}

// Shopify wraps lists in { edges: [{ node }] }; flatten them.
export function reshapeProduct(product: ShopifyProduct): Product {
  return {
    ...product,
    images: product.images.edges.map((e) => e.node),
    variants: product.variants.edges.map((e) => e.node),
  };
}

/** The variant a product card adds to the bag: the cheapest one in stock (matches the "from" price). */
export function defaultVariant(product: Product) {
  const inStock = product.variants.filter((v) => v.availableForSale);
  return [...(inStock.length ? inStock : product.variants)].sort(
    (a, b) => Number(a.price.amount) - Number(b.price.amount),
  )[0];
}
