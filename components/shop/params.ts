// Shop filters live in the URL (?category=…&min=…&max=…&sort=…) so they can be shared and bookmarked.

export const SORT_OPTIONS = [
  { value: "popular", label: "Popularity", sortKey: "BEST_SELLING", reverse: false },
  { value: "newest", label: "Newest first", sortKey: "CREATED_AT", reverse: true },
  { value: "price-asc", label: "Price: low to high", sortKey: "PRICE", reverse: false },
  { value: "price-desc", label: "Price: high to low", sortKey: "PRICE", reverse: true },
] as const;

export type ShopSearchParams = Record<string, string | string[] | undefined>;

export function parseShopParams(params: ShopSearchParams) {
  const all = (key: string) => [params[key] ?? []].flat();
  const price = (key: string) => {
    const n = Number(all(key)[0]);
    return n > 0 ? n : undefined;
  };
  return {
    categories: all("category"),
    min: price("min"),
    max: price("max"),
    sort: SORT_OPTIONS.find((o) => o.value === all("sort")[0]) ?? SORT_OPTIONS[0],
  };
}

// Turns the filters into a Shopify search query, e.g. (tag:"Chairs") AND variants.price:<=500
export function toShopifyQuery({ categories, min, max }: ReturnType<typeof parseShopParams>) {
  const parts: string[] = [];
  if (categories.length) parts.push(`(${categories.map((c) => `tag:"${c}"`).join(" OR ")})`);
  if (min) parts.push(`variants.price:>=${min}`);
  if (max) parts.push(`variants.price:<=${max}`);
  return parts.join(" AND ") || undefined;
}
