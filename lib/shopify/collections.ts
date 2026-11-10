import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { shopifyFetch } from "./client";
import { reshapeProduct } from "./helpers";
import { getCollectionProductsQuery, getCollectionsQuery } from "./queries";
import type { Collection, Product, ShopifyProduct } from "./types";

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("collections");

  const data = await shopifyFetch<{
    collections: { edges: { node: Collection }[] };
  }>(getCollectionsQuery);
  return data.collections.edges.map((e) => e.node);
}

/** Products in a collection, in the order set in Shopify admin. Empty if the collection doesn't exist. */
export async function getCollectionProducts(handle: string, first = 50): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("collections", "products");

  const data = await shopifyFetch<{
    collection: { products: { edges: { node: ShopifyProduct }[] } } | null;
  }>(getCollectionProductsQuery, { handle, first });
  return data.collection?.products.edges.map((e) => reshapeProduct(e.node)) ?? [];
}
