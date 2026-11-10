"use client";

import { createCookieList } from "@/lib/cookie-list/client";
import { COMPARE_COOKIE, MAX_COMPARE } from "./shared";

// The compare list lives in a cookie so the /compare page can read it on the server.
const compare = createCookieList(COMPARE_COOKIE, MAX_COMPARE);

export const readCompare = compare.read;
export const writeCompare = compare.write;
export const toggleCompare = compare.toggle;
export const useCompareList = compare.useList;
