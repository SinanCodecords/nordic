"use client";

import { createCookieList } from "@/lib/cookie-list/client";
import { MAX_RECENT, MAX_WISHLIST, RECENT_COOKIE, WISHLIST_COOKIE } from "./shared";

export const wishlist = createCookieList(WISHLIST_COOKIE, MAX_WISHLIST);
export const recentlyViewed = createCookieList(RECENT_COOKIE, MAX_RECENT);
