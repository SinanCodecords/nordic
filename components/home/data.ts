import { COLLECTIONS } from "@/components/collection/data";
import { toProductCard } from "@/components/shared/from-shopify";
import type { ProductCardData } from "@/components/shared/product-card";
import { getCollection, getProducts } from "@/lib/shopify";

/** The five "Shop by Category" tiles, by Shopify collection handle, with the Figma photo as a fallback. */
const CATEGORY_TILES = [
  { handle: "men", image: "structured-cotton-oxford-shirt" },
  { handle: "women", image: "silk-slip-dress" },
  { handle: "shoes", image: "stride-runner-sneakers" },
  { handle: "accessories", image: "automatic-wristwatch" },
  { handle: "electronics", image: "wireless-noise-cancel-headphones" },
];

export type CategoryTile = { title: string; description: string; href: string; image: string };

/**
 * Title, description and image come from the Shopify collection when it has them. Collections that are
 * missing from Shopify are left out.
 */
export async function getCategoryTiles(): Promise<CategoryTile[]> {
  const tiles = await Promise.all(
    CATEGORY_TILES.map(async ({ handle, image }) => {
      const collection = await getCollection(handle).catch(() => null);
      if (!collection) return null;
      return {
        title: collection.title,
        description: collection.description || COLLECTIONS[handle]?.description || "",
        href: `/collections/${handle}`,
        image: collection.image?.url ?? `/images/products/${image}.jpg`,
      };
    }),
  );
  return tiles.filter((tile) => tile !== null);
}

export type HomeSection = { products: ProductCardData[]; viewAllHref: string };

/**
 * The first four products of a collection, e.g. "trending". While the collection is missing or empty,
 * shows `fallback` instead (Shopify's best sellers or newest products) so the section is never blank.
 */
export async function getHomeSection(
  handle: string,
  fallback: { sortKey: "BEST_SELLING" | "CREATED_AT"; viewAllHref: string },
): Promise<HomeSection> {
  const collection = await getCollection(handle).catch(() => null);
  if (collection?.products.length) {
    return { products: collection.products.slice(0, 4).map(toProductCard), viewAllHref: `/collections/${handle}` };
  }
  const products = await getProducts({
    first: 4,
    sortKey: fallback.sortKey,
    reverse: fallback.sortKey === "CREATED_AT",
  }).catch(() => []);
  return { products: products.map(toProductCard), viewAllHref: fallback.viewAllHref };
}
