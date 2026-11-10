import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { shopifyFetch } from "./client";
import {
  getCartQuantityQuery,
  getProductQuery,
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
