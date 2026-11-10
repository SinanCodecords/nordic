import { parseList } from "@/lib/cookie-list/shared";

export const COMPARE_COOKIE = "compare";

/** Figma: "You can compare up to 4 products at once." */
export const MAX_COMPARE = 4;

export const parseCompare = (value: string | null | undefined) => parseList(value, MAX_COMPARE);
