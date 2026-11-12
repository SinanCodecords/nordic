import "server-only";

import { cookies } from "next/headers";
import { SESSION_COOKIE, unseal, type CustomerSession } from "./session";
import type { Money } from "./types";

const shopId = process.env.SHOPIFY_SHOP_ID;
// The Customer Account API has its own version, separate from the Storefront API's SHOPIFY_API_VERSION.
// 2026-10 is the first with CustomerAddress.countryCode (older versions call it territoryCode).
// The store's current one is listed at https://<store>.myshopify.com/.well-known/customer-account-api
const version = process.env.SHOPIFY_CUSTOMER_API_VERSION ?? "2026-10";

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

export type CustomerAddress = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  zip: string | null;
  /** Province/state code, e.g. "OR". */
  zoneCode: string | null;
  countryCode: string | null;
  phoneNumber: string | null;
  /** Ready-made lines from Shopify, e.g. ["742 Evergreen Terrace", "Springfield OR 97403", "United States"]. */
  formatted: string[];
};

/** EmailMarketingState: SUBSCRIBED, NOT_SUBSCRIBED, UNSUBSCRIBED, PENDING, INVALID, REDACTED. */
export type MarketingState = string;

export type Customer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  displayName: string;
  emailAddress: { emailAddress: string | null; marketingState: MarketingState } | null;
  phoneNumber: { phoneNumber: string } | null;
  defaultAddress: { id: string } | null;
  addresses: { nodes: CustomerAddress[] };
  orders: { nodes: CustomerOrder[] };
};

const customerQuery = /* GraphQL */ `
  query Customer {
    customer {
      id
      firstName
      lastName
      displayName
      emailAddress { emailAddress marketingState }
      phoneNumber { phoneNumber }
      defaultAddress { id }
      addresses(first: 20) {
        nodes {
          id firstName lastName company address1 address2 city zip zoneCode countryCode phoneNumber
          formatted(withName: false, withCompany: true)
        }
      }
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

/** True when the store's Customer Account API is set up in .env (SHOPIFY_SHOP_ID). */
export const customerAccountsEnabled = Boolean(shopId);

type GraphQLResult<T> = { data?: T; errors?: { message: string }[] };

/** Calls the Customer Account API as the logged-in customer. Null when nobody is logged in. */
async function customerFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  const session = await readSession();
  if (!session) return null;

  const res = await fetch(`https://shopify.com/${shopId}/account/customer/api/${version}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: session.accessToken,
      // Shopify checks requests against the JavaScript origin set for the Customer Account API.
      Origin: process.env.NEXT_PUBLIC_BASE_URL ?? "",
    },
    body: JSON.stringify({ query, variables }),
  });
  if (res.status === 401) return null;
  if (!res.ok) {
    throw new Error(`Customer Account API responded ${res.status}: ${(await res.text()).slice(0, 500)}`);
  }

  const json = (await res.json()) as GraphQLResult<T>;
  if (json.errors?.length) {
    throw new Error(`Customer Account API: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  return json.data ?? null;
}

/** The logged-in customer with their orders and addresses, or null when nobody is logged in. */
export async function getCustomer(): Promise<Customer | null> {
  return (await customerFetch<{ customer: Customer }>(customerQuery))?.customer ?? null;
}

// Every mutation answers with { <name>: { …, userErrors } }. Throws the first user error.
async function customerMutate(query: string, variables: Record<string, unknown> = {}) {
  const data = await customerFetch<Record<string, { userErrors: { message: string }[] }>>(query, variables);
  if (!data) throw new Error("You're signed out. Please sign in again.");
  const { userErrors } = Object.values(data)[0];
  if (userErrors.length) throw new Error(userErrors.map((e) => e.message).join("; "));
}

const userErrors = "userErrors { field message }";

export function updateCustomerName(input: { firstName: string; lastName: string }) {
  return customerMutate(
    `mutation customerUpdate($input: CustomerUpdateInput!) { customerUpdate(input: $input) { ${userErrors} } }`,
    { input },
  );
}

export type AddressInput = Omit<CustomerAddress, "id" | "formatted">;

export function createAddress(address: AddressInput, defaultAddress: boolean) {
  return customerMutate(
    `mutation customerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
      customerAddressCreate(address: $address, defaultAddress: $defaultAddress) { ${userErrors} }
    }`,
    { address, defaultAddress },
  );
}

export function updateAddress(addressId: string, address: AddressInput, defaultAddress: boolean) {
  return customerMutate(
    `mutation customerAddressUpdate($addressId: ID!, $address: CustomerAddressInput, $defaultAddress: Boolean) {
      customerAddressUpdate(addressId: $addressId, address: $address, defaultAddress: $defaultAddress) { ${userErrors} }
    }`,
    // Shopify refuses to "un-default" the default address, so only send true.
    { addressId, address, defaultAddress: defaultAddress || null },
  );
}

export function deleteAddress(addressId: string) {
  return customerMutate(
    `mutation customerAddressDelete($addressId: ID!) { customerAddressDelete(addressId: $addressId) { ${userErrors} } }`,
    { addressId },
  );
}

export function setEmailMarketing(subscribed: boolean) {
  const name = subscribed ? "customerEmailMarketingSubscribe" : "customerEmailMarketingUnsubscribe";
  return customerMutate(`mutation ${name} { ${name} { ${userErrors} } }`);
}

async function readSession() {
  return unseal<CustomerSession>((await cookies()).get(SESSION_COOKIE)?.value);
}
