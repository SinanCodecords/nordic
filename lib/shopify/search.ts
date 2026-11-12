import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { shopifyFetch } from "./client";
import { imageFragment, productFragment } from "./fragments";
import { reshapeProduct } from "./helpers";
import type { Image, Money, Product, ShopifyProduct } from "./types";

const searchQuery = /* GraphQL */ `
  query searchProducts($query: String!, $first: Int!) {
    search(query: $query, first: $first, types: [PRODUCT], prefix: LAST, unavailableProducts: LAST) {
      nodes {
        ... on Product {
          ...ProductFields
        }
      }
    }
  }
  ${productFragment}
`;

/**
 * Shopify's product search, best match first. It searches titles, brands, types, tags and descriptions,
 * and copes with plurals and small typos. Sold-out products come last.
 */
export async function searchProducts(query: string, first = 100): Promise<Product[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const data = await shopifyFetch<{ search: { nodes: ShopifyProduct[] } }>(searchQuery, { query, first });
  // Non-product results come back as empty objects.
  return data.search.nodes.filter((node) => node.handle).map(reshapeProduct);
}

const predictiveQuery = /* GraphQL */ `
  query predictiveSearch($query: String!) {
    predictiveSearch(query: $query, limit: 6, types: [PRODUCT, COLLECTION, QUERY], unavailableProducts: LAST) {
      queries {
        text
      }
      collections {
        handle
        title
      }
      products {
        handle
        title
        vendor
        featuredImage {
          ...ImageFields
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
  ${imageFragment}
`;

export type Suggestions = {
  queries: string[];
  collections: { handle: string; title: string }[];
  products: { handle: string; title: string; vendor: string; image: Image | null; price: Money }[];
};

/** Suggestions while typing in the search box: matching products, collections and search phrases. */
export async function getSearchSuggestions(query: string): Promise<Suggestions> {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const { predictiveSearch: result } = await shopifyFetch<{
    predictiveSearch: {
      queries: { text: string }[];
      collections: Suggestions["collections"];
      products: {
        handle: string;
        title: string;
        vendor: string;
        featuredImage: Image | null;
        priceRange: { minVariantPrice: Money };
      }[];
    };
  }>(predictiveQuery, { query });

  return {
    queries: result.queries.map((q) => q.text),
    collections: result.collections,
    products: result.products.map((p) => ({
      handle: p.handle,
      title: p.title,
      vendor: p.vendor,
      image: p.featuredImage,
      price: p.priceRange.minVariantPrice,
    })),
  };
}
