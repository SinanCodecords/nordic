import "server-only";

import { getProduct } from "@/lib/shopify";
import type { ProductDetail } from "./data";
import { toProductDetail } from "./from-shopify";

/**
 * Full details for saved product handles (compare, wishlist, recently viewed). Handles that no longer
 * exist in Shopify are skipped, so an old cookie never breaks a page.
 */
export async function getProductDetails(handles: string[]): Promise<ProductDetail[]> {
  const products = await Promise.all(handles.map((handle) => getProduct(handle).catch(() => null)));
  return products.filter((p) => p !== null).map((p) => toProductDetail(p, { related: [], stock: null }));
}
