import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { shopifyFetch } from "./client";
import {
  getCartQuantityQuery,
  getProductHandlesQuery,
  getProductQuery,
  getProductStockQuery,
  getProductRecommendationsQuery,
  getProductsQuery,
} from "./queries";
import { reshapeProduct } from "./helpers";
import type { Product, ShopifyProduct } from "./types";

export type * from "./types";
export * from "./helpers";
export * from "./collections";
export * from "./customer";
export * from "./cart";

export async function getProducts({
  first = 50,
  sortKey,
  reverse,
  query,
}: {
  first?: number;
  sortKey?: "RELEVANCE" | "BEST_SELLING" | "CREATED_AT" | "PRICE" | "TITLE";
  reverse?: boolean;
  query?: string;
} = {}): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const data = await shopifyFetch<{
    products: { edges: { node: ShopifyProduct }[] };
  }>(getProductsQuery, { first, sortKey, reverse, query });
  return data.products.edges.map((e) => reshapeProduct(e.node));
}

export async function getProduct(handle: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(
    getProductQuery,
    { handle },
  );
  return data.product ? reshapeProduct(data.product) : null;
}

/** Every product handle, for pre-building product pages. */
export async function getProductHandles(): Promise<string[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const data = await shopifyFetch<{ products: { nodes: { handle: string }[] } }>(getProductHandlesQuery, {
    first: 250,
  });
  return data.products.nodes.map((p) => p.handle);
}

async function fetchProductStock(handle: string) {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const data = await shopifyFetch<{
    product: { variants: { nodes: { id: string; quantityAvailable: number | null }[] } } | null;
  }>(getProductStockQuery, { handle });
  return Object.fromEntries(data.product?.variants.nodes.map((v) => [v.id, v.quantityAvailable]) ?? []);
}

/**
 * Units left per variant ID. Null when the storefront token lacks the "product inventory" permission,
 * in which case the page only knows in stock / sold out.
 */
export async function getProductStock(handle: string): Promise<Record<string, number | null> | null> {
  return fetchProductStock(handle).catch(() => null);
}

// Shopify's own "you may also like" picks for a product.
export async function getProductRecommendations(productId: string): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const data = await shopifyFetch<{ productRecommendations: ShopifyProduct[] | null }>(
    getProductRecommendationsQuery,
    { productId },
  );
  return (data.productRecommendations ?? []).map(reshapeProduct);
}

/** Not cached: a cart changes on every add or remove. */
export async function getCartQuantity(cartId: string): Promise<number> {
  const data = await shopifyFetch<{ cart: { totalQuantity: number } | null }>(
    getCartQuantityQuery,
    { id: cartId },
  );
  return data.cart?.totalQuantity ?? 0;
}
