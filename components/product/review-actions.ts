"use server";

import { reviewsEnabled, submitReview } from "@/lib/reviews/judgeme";

export type ReviewActionResult = { ok?: boolean; error?: string };

export async function writeReview(_prev: ReviewActionResult, form: FormData): Promise<ReviewActionResult> {
  const productId = String(form.get("productId") ?? "");
  if (!reviewsEnabled || !productId) return { error: "Reviews aren't connected yet." };

  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const title = String(form.get("title") ?? "").trim();
  const body = String(form.get("body") ?? "").trim();
  const rating = Number(form.get("rating"));

  if (!name || !email || !body) return { error: "Please fill in your name, email and review." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return { error: "Please choose a star rating." };

  try {
    return (await submitReview({ productId, name, email, rating, title, body }))
      ? { ok: true }
      : { error: "Couldn't send your review. Please try again." };
  } catch {
    return { error: "Couldn't reach the reviews service. Please try again." };
  }
}
