import { pickProducts } from "@/components/shared/demo-products";

// Static content from the Figma landing page (products come from shared/demo-products).

export const CATEGORIES = [
  { title: "Men", description: "Modern essentials and elevated staples for everyday wear.", image: "structured-cotton-oxford-shirt" },
  { title: "Women", description: "Considered pieces designed for life in motion.", image: "silk-slip-dress" },
  { title: "Shoes", description: "Footwear built for comfort, made for everyday.", image: "stride-runner-sneakers" },
  { title: "Accessories", description: "The finishing details that complete the look.", image: "automatic-wristwatch" },
  { title: "Electronics", description: "Audio and tech essentials with clean design.", image: "wireless-noise-cancel-headphones" },
].map((c) => ({ ...c, href: `/collections/${c.title.toLowerCase()}`, image: `/images/products/${c.image}.jpg` }));

export const TRENDING = pickProducts(
  "structured-cotton-oxford-shirt",
  "relaxed-selvedge-denim",
  "tailored-wool-blazer",
  "silk-slip-dress",
);

export const BEST_SELLERS = pickProducts(
  "structured-cotton-oxford-shirt",
  "merino-crewneck-sweater",
  "essential-cotton-tee",
  "cashmere-cardigan",
);

export const NEW_ARRIVALS = pickProducts(
  "merino-crewneck-sweater",
  "tailored-wool-blazer",
  "pleated-midi-skirt",
  "leather-loafers",
);
