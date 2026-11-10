import { parseList } from "@/lib/cookie-list/shared";

// Saved on this device for now. TODO: move to a customer metafield so it follows the account.
export const WISHLIST_COOKIE = "wishlist";
export const MAX_WISHLIST = 40;
export const parseWishlist = (value: string | null | undefined) => parseList(value, MAX_WISHLIST);

export const RECENT_COOKIE = "recently-viewed";
export const MAX_RECENT = 8;
export const parseRecent = (value: string | null | undefined) => parseList(value, MAX_RECENT);
