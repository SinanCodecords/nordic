import { createLoader, parseAsString } from "nuqs/server";
import { toProductCard } from "@/components/shared/from-shopify";
import type { ProductCardData } from "@/components/shared/product-card";
import { searchProducts } from "@/lib/shopify";

export const loadSearchParams = createLoader({ q: parseAsString.withDefault("") });

/** Shopify search results as product cards, best match first. Empty for a blank query or if Shopify fails. */
export async function findProducts(query: string): Promise<ProductCardData[]> {
  if (!query) return [];
  const products = await searchProducts(query).catch((error) => {
    console.error(error);
    return [];
  });
  return products.map(toProductCard);
}
