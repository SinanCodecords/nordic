export const COMPARE_COOKIE = "compare";

/** Figma: "You can compare up to 4 products at once." */
export const MAX_COMPARE = 4;

export function parseCompare(value: string | null | undefined): string[] {
  if (!value) return [];
  return [...new Set(decodeURIComponent(value).split(",").filter(Boolean))].slice(0, MAX_COMPARE);
}
