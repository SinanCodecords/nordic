import { pickProducts } from "@/components/shared/demo-products";
import type { ProductCardData } from "@/components/shared/product-card";

// Static collections from the Figma file. Replace with Shopify's `collection(handle:)` query
// (lib/shopify/collections.ts) once the store is connected.

export type CollectionData = {
  title: string;
  description: string;
  products: ProductCardData[];
};

/** Brand filter options, in the order the Figma sidebar lists them. */
export const BRANDS = ["Northwind", "Atlas", "Forme", "Stride", "Lumen", "Kinfolk", "Meridian", "Cove"];

export const COLLECTIONS: Record<string, CollectionData> = {
  "new-arrivals": {
    title: "New Arrivals",
    description: "The latest additions to our collection.",
    products: pickProducts(
      "tailored-wool-blazer",
      "merino-crewneck-sweater",
      "pleated-midi-skirt",
      "leather-loafers",
      "knit-slip-on-mules",
      "polarized-sunglasses",
      "quilted-liner-jacket",
      "sport-trail-runners",
    ),
  },
  men: {
    title: "Men",
    description: "Modern essentials and elevated staples for everyday wear.",
    products: pickProducts(
      "structured-cotton-oxford-shirt",
      "relaxed-selvedge-denim",
      "merino-crewneck-sweater",
      "essential-cotton-tee",
      "quilted-liner-jacket",
    ),
  },
  women: {
    title: "Women",
    description: "Considered pieces designed for life in motion.",
    products: pickProducts(
      "tailored-wool-blazer",
      "silk-slip-dress",
      "relaxed-chino-pants",
      "cashmere-cardigan",
      "pleated-midi-skirt",
    ),
  },
};

/** Links in the category bar under the header. */
export const CATEGORY_LINKS = ["Men", "Women", "Shoes", "Accessories", "Electronics"].map((label) => ({
  label,
  href: `/collections/${label.toLowerCase()}`,
}));
