"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import {
  addToCart,
  applyDiscountCode,
  getCart,
  linkCartToCustomer,
  updateCartLine,
} from "@/lib/shopify";

export type CartActionResult = { error?: string };

const failed = (error: unknown, fallback: string): CartActionResult => {
  console.error(error);
  return { error: fallback };
};

export async function addItem(variantId: string, quantity = 1): Promise<CartActionResult> {
  try {
    await addToCart(variantId, quantity);
  } catch (error) {
    return failed(error, "Couldn't add this to your bag. Please try again.");
  }
  refresh();
  return {};
}

/** Adds the item and goes straight to Shopify checkout. */
export async function buyNow(variantId: string, quantity = 1): Promise<CartActionResult> {
  let checkoutUrl: string;
  try {
    await addToCart(variantId, quantity);
    checkoutUrl = ((await linkCartToCustomer().catch(() => null)) ?? (await getCart()))!.checkoutUrl;
  } catch (error) {
    return failed(error, "Couldn't start checkout. Please try again.");
  }
  redirect(checkoutUrl);
}

export async function updateQuantity(lineId: string, quantity: number): Promise<CartActionResult> {
  try {
    await updateCartLine(lineId, Math.max(0, quantity));
  } catch (error) {
    return failed(error, "Couldn't update your bag. Please try again.");
  }
  refresh();
  return {};
}

export async function applyCoupon(_: CartActionResult, formData: FormData): Promise<CartActionResult> {
  const code = String(formData.get("coupon") ?? "").trim().toUpperCase();
  try {
    const cart = await applyDiscountCode(code);
    if (code && !cart.discountCodes.some((d) => d.code.toUpperCase() === code && d.applicable)) {
      await applyDiscountCode("");
      return { error: `"${code}" isn't a valid code for this bag.` };
    }
  } catch (error) {
    return failed(error, "Couldn't apply that code. Please try again.");
  }
  refresh();
  return {};
}

/** Links the cart to the logged-in customer, then hands over to Shopify checkout. */
export async function checkout() {
  const cart = (await linkCartToCustomer().catch(() => null)) ?? (await getCart());
  redirect(cart ? cart.checkoutUrl : "/cart");
}
