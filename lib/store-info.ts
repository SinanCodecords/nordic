/**
 * Store details shown on the Contact page, the 404 page and the footer.
 * TODO: replace the email with the store's real support address before going live.
 */
export const STORE = {
  name: "Nordic",
  tagline: "Considered essentials, built to last.",
  email: "support@example.com",
  replyTime: "We reply within one business day.",
};

/** Shopify's built-in policy pages (Settings → Policies), in footer order. */
export const POLICIES = [
  { handle: "shipping-policy", label: "Shipping Policy" },
  { handle: "refund-policy", label: "Returns & Refunds" },
  { handle: "privacy-policy", label: "Privacy Policy" },
  { handle: "terms-of-service", label: "Terms of Service" },
] as const;

export type PolicyHandle = (typeof POLICIES)[number]["handle"];

export const policyHref = (handle: PolicyHandle) => `/policies/${handle}`;
