import { pickProducts } from "@/components/shared/demo-products";
import type { ProductCardData } from "@/components/shared/product-card";

// Static collections from the Figma file. Replace with Shopify's `collection(handle:)` query
// (lib/shopify/collections.ts) once the store is connected.

export type CollectionData = {
  title: string;
  description: string;
  products: ProductCardData[];
};

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
  shoes: {
    title: "Shoes",
    description: "Footwear built for comfort, made for everyday.",
    products: pickProducts(
      "stride-runner-sneakers",
      "court-classic-sneakers",
      "leather-loafers",
      "knit-slip-on-mules",
      "sport-trail-runners",
    ),
  },
  accessories: {
    title: "Accessories",
    description: "The finishing details that complete the look.",
    products: pickProducts(
      "structured-tote-handbag",
      "automatic-wristwatch",
      "pearl-layering-necklace",
      "leather-weekender-bag",
      "polarized-sunglasses",
      "minimalist-leather-wallet",
    ),
  },
  electronics: {
    title: "Electronics",
    description: "Audio and tech essentials with clean design.",
    products: pickProducts("wireless-noise-cancel-headphones", "true-wireless-earbuds", "portable-bluetooth-speaker"),
  },
};

/** Links in the category bar under the header. */
export const CATEGORY_LINKS = ["Men", "Women", "Shoes", "Accessories", "Electronics"].map((label) => ({
  label,
  href: `/collections/${label.toLowerCase()}`,
}));
