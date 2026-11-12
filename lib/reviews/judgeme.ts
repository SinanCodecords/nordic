import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import type { Review } from "./types";

// Product reviews come from the Judge.me app (Shopify doesn't store reviews itself).
// Docs: https://judge.me/api/docs

const API = "https://api.judge.me/api/v1";
const shop = process.env.SHOPIFY_STORE_DOMAIN;
const privateToken = process.env.JUDGEME_PRIVATE_TOKEN;

export const reviewsEnabled = Boolean(shop && privateToken);

type RawReview = {
  id: number;
  title: string | null;
  body: string | null;
  rating: number;
  pinned: boolean;
  product_external_id: number | null;
  reviewer?: { name?: string | null } | null;
  curated: string;
  hidden: boolean;
  verified: string;
  created_at: string;
};

/**
 * All published reviews, grouped by Shopify product number. Judge.me's list endpoint filters by its own
 * product ID, not Shopify's, so we read the whole list once and cache it for an hour.
 */
async function getPublishedReviews(): Promise<Record<string, Review[]>> {
  "use cache";
  cacheLife("hours");
  cacheTag("reviews");

  const byProduct: Record<string, Review[]> = {};
  for (let page = 1; page <= 50; page++) {
    const params = new URLSearchParams({ shop_domain: shop!, per_page: "100", page: String(page) });
    const res = await fetch(`${API}/reviews?${params}`, { headers: { "X-Api-Token": privateToken! } });
    if (!res.ok) throw new Error(`Judge.me responded ${res.status}`);

    const { reviews, per_page } = (await res.json()) as { reviews: RawReview[]; per_page: number };
    for (const r of reviews) {
      // The list also holds unpublished reviews and store reviews.
      if (r.curated !== "ok" || r.hidden || !r.product_external_id) continue;
      (byProduct[r.product_external_id] ??= []).push({
        id: r.id,
        rating: r.rating,
        title: r.title ?? "",
        body: r.body ?? "",
        author: r.reviewer?.name || "Anonymous",
        verified: r.verified === "buyer",
        pinned: r.pinned,
        createdAt: r.created_at,
      });
    }
    if (reviews.length < per_page) break;
  }
  return byProduct;
}

/** Published reviews for one product. Empty when Judge.me isn't set up. */
export async function getProductReviews(productId: string | undefined): Promise<Review[]> {
  if (!reviewsEnabled || !productId) return [];
  try {
    return (await getPublishedReviews())[productId.split("/").pop()!] ?? [];
  } catch (error) {
    console.error("Couldn't load reviews", error);
    return [];
  }
}

/** Sends a review the same way Judge.me's own form does. It may wait for approval before it shows. */
export async function submitReview(input: {
  productId: string;
  name: string;
  email: string;
  rating: number;
  title: string;
  body: string;
}): Promise<boolean> {
  const res = await fetch(`${API}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      shop_domain: shop,
      platform: "shopify",
      id: Number(input.productId.split("/").pop()),
      name: input.name,
      email: input.email,
      rating: input.rating,
      title: input.title,
      body: input.body,
    }),
  });
  return res.ok;
}
