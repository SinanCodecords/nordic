import { parseList } from "@/lib/cookie-list/shared";

export const COMPARE_COOKIE = "compare";

/** Figma: "You can compare up to 4 products at once." */
export const MAX_COMPARE = 4;

export const parseCompare = (value: string | null | undefined) => parseList(value, MAX_COMPARE);

/** The Compare pill on product cards. Shared so the empty compare page can show what it looks like. */
export const comparePill =
  "inline-flex h-6 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold text-foreground";
