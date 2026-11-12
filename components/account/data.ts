import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getProductDetails } from "@/components/product/load";
import { parseRecent, parseWishlist, RECENT_COOKIE, WISHLIST_COOKIE } from "@/components/wishlist/shared";
import { type Customer, customerAccountsEnabled, getCustomer } from "@/lib/shopify/customer";

export type Account = {
  customer: Customer;
  /** True while the store isn't connected: the page shows the Figma sample customer. */
  demo: boolean;
};

/** Alex Morgan from the Figma account screens, shown until Shopify customer accounts are set up. */
const DEMO_CUSTOMER: Customer = {
  id: "demo",
  firstName: "Alex",
  lastName: "Morgan",
  displayName: "Alex Morgan",
  emailAddress: { emailAddress: "alex.morgan@example.com", marketingState: "SUBSCRIBED" },
  phoneNumber: { phoneNumber: "555-0142" },
  defaultAddress: { id: "demo-address" },
  addresses: {
    nodes: [
      {
        id: "demo-address",
        firstName: "Alex",
        lastName: "Morgan",
        company: null,
        address1: "742 Evergreen Terrace",
        address2: "Apt 5B",
        city: "Springfield",
        zip: "97403",
        zoneCode: "OR",
        countryCode: "US",
        phoneNumber: "555-0142",
        formatted: ["742 Evergreen Terrace, Apt 5B", "Springfield, OR 97403"],
      },
    ],
  },
  orders: { nodes: [] },
};

/**
 * The signed-in customer for account pages. Sends visitors to Shopify login when the store is
 * connected, and falls back to the demo customer when it isn't.
 */
export async function getAccount(path: string): Promise<Account> {
  if (!customerAccountsEnabled) return { customer: DEMO_CUSTOMER, demo: true };

  const customer = await getCustomer();
  if (!customer) redirect(`/account/login?next=${encodeURIComponent(path)}`);
  return { customer, demo: false };
}

/** Products saved with the heart button (kept in a cookie on this device). */
export async function getWishlistProducts() {
  return getProductDetails(parseWishlist((await cookies()).get(WISHLIST_COOKIE)?.value));
}

/** Product pages opened recently on this device, newest first. */
export async function getRecentlyViewed() {
  return getProductDetails(parseRecent((await cookies()).get(RECENT_COOKIE)?.value));
}
