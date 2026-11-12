"use server";

import { getSearchSuggestions, type Suggestions } from "@/lib/shopify";

const NONE: Suggestions = { queries: [], collections: [], products: [] };

/** Called by the search box while the shopper types. */
export async function suggest(query: string): Promise<Suggestions> {
  const q = query.trim().slice(0, 100);
  if (q.length < 2) return NONE;
  return getSearchSuggestions(q).catch(() => NONE);
}
