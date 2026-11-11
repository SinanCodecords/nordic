import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { PolicyHandle } from "@/lib/store-info";
import { shopifyFetch } from "./client";

/** Policy pages are written in Shopify admin → Settings → Policies. `body` is HTML. */
export type ShopPolicy = { title: string; body: string };

export const storefrontEnabled = Boolean(
  process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN,
);

const FIELDS: Record<PolicyHandle, string> = {
  "privacy-policy": "privacyPolicy",
  "refund-policy": "refundPolicy",
  "shipping-policy": "shippingPolicy",
  "terms-of-service": "termsOfService",
};

/** Null when the store hasn't written this policy yet. */
export async function getPolicy(handle: PolicyHandle): Promise<ShopPolicy | null> {
  "use cache";
  cacheLife("days");
  cacheTag("policies");

  const field = FIELDS[handle];
  const data = await shopifyFetch<{ shop: Record<string, ShopPolicy | null> }>(
    `query getPolicy { shop { ${field} { title body } } }`,
  );
  return data.shop[field] ?? null;
}
