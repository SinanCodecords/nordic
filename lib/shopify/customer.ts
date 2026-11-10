import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE, unseal, type CustomerSession } from "./session";
import type { Money } from "./types";

const shopId = process.env.SHOPIFY_SHOP_ID;
const version = process.env.SHOPIFY_API_VERSION ?? "2026-07";

export type CustomerOrder = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  statusPageUrl: string;
  totalPrice: Money;
  lineItems: { nodes: { title: string; quantity: number }[] };
  /** OrderFulfillmentStatus, e.g. UNFULFILLED, PARTIALLY_FULFILLED, FULFILLED. */
  fulfillmentStatus: string;
  cancelledAt: string | null;
  fulfillments: { nodes: CustomerFulfillment[] };
};

export type CustomerFulfillment = {
  id: string;
  /** FulfillmentStatus: SUCCESS, CANCELLED, ERROR, FAILURE. */
  status: string | null;
  /** FulfillmentEventStatus: LABEL_PRINTED, IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED… */
  latestShipmentStatus: string | null;
  estimatedDeliveryAt: string | null;
  updatedAt: string;
  trackingInformation: { company: string | null; number: string | null; url: string | null }[];
};

export type Customer = {
  firstName: string | null;
  lastName: string | null;
  emailAddress: { emailAddress: string } | null;
  orders: { nodes: CustomerOrder[] };
};

const customerQuery = /* GraphQL */ `
  query Customer {
    customer {
      firstName
      lastName
      emailAddress { emailAddress }
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          financialStatus
          statusPageUrl
          totalPrice { amount currencyCode }
          lineItems(first: 10) { nodes { title quantity } }
          fulfillmentStatus
          cancelledAt
          fulfillments(first: 5) {
            nodes {
              id
              status
              latestShipmentStatus
              estimatedDeliveryAt
              updatedAt
              trackingInformation { company number url }
            }
          }
        }
      }
    }
  }
`;

/** The logged-in customer's token, used to link the cart to their account. */
export async function getCustomerAccessToken() {
  return (await readSession())?.accessToken ?? null;
}

/** True when a login cookie is present (the proxy already refreshed it if needed). */
export async function isLoggedIn() {
  return Boolean(await readSession());
}

/** The logged-in customer with their orders, or null when nobody is logged in. */
export async function getCustomer(): Promise<Customer | null> {
  const session = await readSession();
  if (!session) return null;

  const res = await fetch(`https://shopify.com/${shopId}/account/customer/api/${version}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: session.accessToken },
    body: JSON.stringify({ query: customerQuery }),
  });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Customer Account API responded ${res.status}`);

  const json = (await res.json()) as { data?: { customer: Customer }; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join("; "));
  return json.data?.customer ?? null;
}

async function readSession() {
  return unseal<CustomerSession>((await cookies()).get(SESSION_COOKIE)?.value);
}
