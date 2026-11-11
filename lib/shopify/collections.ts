import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { shopifyFetch } from "./client";
import { reshapeProduct } from "./helpers";
import { getCollectionProductsQuery, getCollectionQuery, getCollectionsQuery, getProductsQuery } from "./queries";
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

export type CollectionWithProducts = {
  handle: string;
  title: string;
  description: string;
  seo: { title: string | null; description: string | null };
  /** In the order set in Shopify admin (Collection → Sort). */
  products: Product[];
};

/**
 * A collection and its products (up to 250). "all" lists every product, like Shopify's own /collections/all.
 * Null when the collection doesn't exist or isn't in the Headless sales channel.
 */
export async function getCollection(handle: string): Promise<CollectionWithProducts | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("collections", "products");

  const data = await shopifyFetch<{
    collection: (Omit<CollectionWithProducts, "products"> & { products: { nodes: ShopifyProduct[] } }) | null;
  }>(getCollectionQuery, { handle, first: 250 });

  if (!data.collection) {
    if (handle !== "all") return null;
    const all = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>(getProductsQuery, {
      first: 250,
      sortKey: "BEST_SELLING",
    });
    const products = all.products.edges.map((e) => reshapeProduct(e.node));
    return { handle, title: "All Products", description: "", seo: { title: null, description: null }, products };
  }
  return { ...data.collection, products: data.collection.products.nodes.map(reshapeProduct) };
}
