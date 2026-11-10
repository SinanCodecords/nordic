import "server-only";

import { cookies } from "next/headers";
import { shopifyFetch } from "./client";
import { getCustomerAccessToken } from "./customer";
import * as q from "./cart-queries";
import type { Image, Money } from "./types";

export const CART_COOKIE = "cartId";

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    image: Image | null;
    product: { handle: string; title: string; featuredImage: Image | null };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  discountCodes: { code: string; applicable: boolean }[];
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { nodes: CartLine[] };
};

type Payload = { cart: Cart | null; userErrors: { message: string }[] };

// Every cart mutation answers with { <name>: { cart, userErrors } }.
async function mutate(query: string, variables: Record<string, unknown>): Promise<Cart> {
  const data = await shopifyFetch<Record<string, Payload>>(query, variables);
  const { cart, userErrors } = Object.values(data)[0];
  if (userErrors.length) throw new Error(userErrors.map((e) => e.message).join("; "));
  if (!cart) throw new Error("Shopify returned no cart");
  return cart;
}

const cartId = async () => (await cookies()).get(CART_COOKIE)?.value;

/** The shopper's cart, or null when they have none (or it expired). Never cached. */
export async function getCart(): Promise<Cart | null> {
  const id = await cartId();
  if (!id) return null;
  const data = await shopifyFetch<{ cart: Cart | null }>(q.getCartQuery, { id });
  return data.cart;
}

/** Adds a variant, creating a new cart (linked to the logged-in customer) if needed. */
export async function addToCart(merchandiseId: string, quantity: number): Promise<Cart> {
  const lines = [{ merchandiseId, quantity }];
  if (await getCart()) return mutate(q.addLinesMutation, { cartId: await cartId(), lines });

  const customerAccessToken = await getCustomerAccessToken();
  const cart = await mutate(q.createCartMutation, {
    input: { lines, ...(customerAccessToken && { buyerIdentity: { customerAccessToken } }) },
  });
  (await cookies()).set(CART_COOKIE, cart.id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return cart;
}

/** Sets a line's quantity; 0 removes it. */
export async function updateCartLine(lineId: string, quantity: number) {
  return mutate(q.updateLinesMutation, { cartId: await cartId(), lines: [{ id: lineId, quantity }] });
}

export async function applyDiscountCode(code: string) {
  return mutate(q.discountCodesMutation, { cartId: await cartId(), codes: code ? [code] : [] });
}

/** Links the cart to the logged-in customer so checkout knows who they are. */
export async function linkCartToCustomer() {
  const customerAccessToken = await getCustomerAccessToken();
  const id = await cartId();
  if (!customerAccessToken || !id) return null;
  return mutate(q.buyerIdentityMutation, { cartId: id, buyerIdentity: { customerAccessToken } });
}
