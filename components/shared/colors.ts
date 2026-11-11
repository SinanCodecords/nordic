/**
 * Swatch colours for colour names. Shopify only sends a colour when the store sets one on the option value
 * (Products → Color → swatch), so these cover the names our products use. Add new colour names here.
 */
export const COLORS: Record<string, string> = {
  Ivory: "#f5f5f4",
  Stone: "#d6d3d1",
  Silver: "#a8a29e",
  Navy: "#1e3a5f",
  "Light Wash": "#6b8cae",
  Black: "#1c1917",
  Champagne: "#e6d7c1",
  Charcoal: "#44403c",
  Camel: "#c19a6b",
  Gold: "#d4a72c",
  Red: "#dc2626",
  Khaki: "#c3b091",
  Oat: "#e7e0d4",
  Blush: "#d4a5a5",
  Olive: "#556b2f",
  Tan: "#a16207",
  Pink: "#f9a8d4",
  Brown: "#8b4513",
  Gray: "#c0c0c0",
  Grey: "#c0c0c0",
  Orange: "#f97316",
  Blue: "#3b5b8c",
  White: "#ffffff",
  Cream: "#f3ead8",
  Beige: "#e8dcc4",
  Green: "#3f6f4a",
  Yellow: "#facc15",
  Purple: "#7c3aed",
};

const FALLBACK = "#d6d3d1";

/** The swatch for a colour: the one set in Shopify, else our list, else neutral stone. */
export function colorHex(name: string, swatch?: string | null) {
  return swatch ?? COLORS[name] ?? FALLBACK;
}
