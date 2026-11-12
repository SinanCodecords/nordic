import type { ProductCardData } from "@/components/shared/product-card";

/** What a collection page (or the search page) lists. */
export type CollectionData = {
  title: string;
  description: string;
  products: ProductCardData[];
};

/** Wording from the Figma file, shown while a collection's description is empty in Shopify. */
export const COLLECTION_DESCRIPTIONS: Record<string, string> = {
  "new-arrivals": "The latest additions to our collection.",
  men: "Modern essentials and elevated staples for everyday wear.",
  women: "Considered pieces designed for life in motion.",
  shoes: "Footwear built for comfort, made for everyday.",
  accessories: "The finishing details that complete the look.",
  electronics: "Audio and tech essentials with clean design.",
};

/** Links in the category bar under the header. */
export const CATEGORY_LINKS = ["Men", "Women", "Shoes", "Accessories", "Electronics"].map((label) => ({
  label,
  href: `/collections/${label.toLowerCase()}`,
}));
