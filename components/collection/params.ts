import {
  createLoader,
  parseAsArrayOf,
  parseAsFloat,
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs/server";
import type { ProductCardData } from "@/components/shared/product-card";

// Collection filters live in the URL (?brand=Cove&max=200&rating=4&sort=price-asc&view=list),
// so a filtered page can be shared or bookmarked. The same parsers run on the server and in the browser.

export const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
] as const;

export const PRICE_CEILING = 400; // the slider's top end means "$400 and up"
export const RATING_OPTIONS = [0, 3, 4, 4.5];

export const collectionParsers = {
  brand: parseAsArrayOf(parseAsString).withDefault([]),
  min: parseAsInteger.withDefault(0),
  max: parseAsInteger.withDefault(PRICE_CEILING),
  rating: parseAsFloat.withDefault(0),
  sort: parseAsStringLiteral(SORT_OPTIONS.map((o) => o.value)).withDefault("featured"),
  view: parseAsStringLiteral(["grid", "list"]).withDefault("grid"),
};

export const loadCollectionParams = createLoader(collectionParsers);

export type CollectionParams = Awaited<ReturnType<typeof loadCollectionParams>>;

/** True when any filter (not sort or view) is applied. */
export const hasActiveFilters = ({ brand, min, max, rating }: CollectionParams) =>
  brand.length > 0 || min > 0 || max < PRICE_CEILING || rating > 0;

const price = (p: ProductCardData) => Number(p.price.amount);

// Filtering runs here rather than in Shopify's query: each collection is fetched (and cached) once, so
// changing a filter needs no new Shopify request. Fine for collections of up to a few hundred products.
export function filterProducts(products: ProductCardData[], params: CollectionParams) {
  const { brand, min, max, rating, sort } = params;
  const result = products.filter(
    (p) =>
      (brand.length === 0 || brand.includes(p.vendor)) &&
      price(p) >= min &&
      (max >= PRICE_CEILING || price(p) <= max) &&
      p.rating >= rating,
  );

  switch (sort) {
    case "newest":
      // Demo products have no date; their lists are oldest-first.
      return result.every((p) => p.createdAt)
        ? result.toSorted((a, b) => b.createdAt!.localeCompare(a.createdAt!))
        : result.toReversed();
    case "price-asc":
      return result.toSorted((a, b) => price(a) - price(b));
    case "price-desc":
      return result.toSorted((a, b) => price(b) - price(a));
    case "rating":
      return result.toSorted((a, b) => b.rating - a.rating);
    default:
      return result;
  }
}
