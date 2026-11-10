// Small lists of product handles kept in a cookie (compare, wishlist, recently viewed), so
// server pages can read them. This file is safe on both server and browser.

export function parseList(value: string | null | undefined, max: number): string[] {
  if (!value) return [];
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {}
  return [...new Set(decoded.split(",").filter(Boolean))].slice(0, max);
}
