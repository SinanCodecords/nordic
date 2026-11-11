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

/** A metafield's raw value, e.g. metafield(product, "custom", "materials"). */
export function metafield(product: Product, namespace: string, key: string) {
  return product.metafields.find((m) => m?.namespace === namespace && m.key === key)?.value;
}

/** A "list of single line text" metafield as an array. Empty when unset. */
export function metafieldList(product: Product, namespace: string, key: string): string[] {
  const value = metafield(product, namespace, key);
  if (!value) return [];
  try {
    const list = JSON.parse(value);
    return Array.isArray(list) ? list.map(String).filter(Boolean) : [];
  } catch {
    return [];
  }
}

/** The star rating Judge.me saves on each product (reviews.rating / reviews.rating_count). 0 when there are none. */
export function productRating(product: Product) {
  const count = Number(metafield(product, "reviews", "rating_count") ?? 0) || 0;
  let rating = 0;
  try {
    rating = Number(JSON.parse(metafield(product, "reviews", "rating") ?? "{}").value) || 0;
  } catch {}
  return { rating: Math.round(rating * 10) / 10, reviewCount: count };
}

/** The option values for "Color"/"Colour" or "Size" (any case), in the order set in Shopify. */
export function optionValues(product: Product, ...names: string[]) {
  const option = product.options.find((o) => names.includes(o.name.toLowerCase()));
  return option?.optionValues ?? [];
}

/** A variant's value for one of the named options, e.g. variantOption(v, "color", "colour"). */
export function variantOption(variant: Product["variants"][number], ...names: string[]) {
  return variant.selectedOptions.find((o) => names.includes(o.name.toLowerCase()))?.value;
}
