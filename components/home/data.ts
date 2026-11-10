import type { ProductCardData } from "@/components/shared/product-card";

// Static content from the Figma landing page. Swap the product lists for Shopify
// collections (e.g. getCollectionProducts("trending")) once the store is connected.

export const CATEGORIES = [
  { title: "Men", description: "Modern essentials and elevated staples for everyday wear.", image: "structured-cotton-oxford-shirt" },
  { title: "Women", description: "Considered pieces designed for life in motion.", image: "silk-slip-dress" },
  { title: "Shoes", description: "Footwear built for comfort, made for everyday.", image: "stride-runner-sneakers" },
  { title: "Accessories", description: "The finishing details that complete the look.", image: "automatic-wristwatch" },
  { title: "Electronics", description: "Audio and tech essentials with clean design.", image: "wireless-noise-cancel-headphones" },
].map((c) => ({ ...c, href: `/collections/${c.title.toLowerCase()}`, image: `/images/products/${c.image}.jpg` }));

const usd = (amount: number) => ({ amount: amount.toFixed(2), currencyCode: "USD" });

type Row = [handle: string, title: string, vendor: string, badge: ProductCardData["badge"], price: number, compareAt: number, rating: number, reviews: number, swatches: string[], image?: string];

const product = ([handle, title, vendor, badge, price, compareAt, rating, reviewCount, swatches, image = handle]: Row): ProductCardData => ({
  handle,
  title,
  vendor,
  badge,
  price: usd(price),
  compareAtPrice: usd(compareAt),
  rating,
  reviewCount,
  swatches,
  image: `/images/products/${image}.jpg`,
});

const oxfordShirt: Row = ["structured-cotton-oxford-shirt", "Structured Cotton Oxford Shirt", "Northwind", "Trending", 68, 89, 4.6, 214, ["#f5f5f4", "#d6d3d1", "#a8a29e"]];
const woolBlazer: Row = ["tailored-wool-blazer", "Tailored Wool Blazer", "Meridian", "New", 198, 260, 4.7, 89, ["#1c1917", "#f5f5f4"]];
const merinoSweater: Row = ["merino-crewneck-sweater", "Merino Crewneck Sweater", "Forme", "Best Seller", 94, 120, 4.8, 186, ["#44403c", "#c19a6b"]];

export const TRENDING = [
  oxfordShirt,
  ["relaxed-selvedge-denim", "Relaxed Selvedge Denim", "Atlas", "Trending", 88, 110, 4.5, 142, ["#1e3a5f", "#6b8cae"]],
  woolBlazer,
  ["silk-slip-dress", "Silk Slip Dress", "Cove", "Trending", 142, 185, 4.6, 127, ["#e6d7c1", "#1c1917"]],
].map((r) => product(r as Row));

export const BEST_SELLERS = [
  oxfordShirt,
  merinoSweater,
  ["essential-cotton-tee", "Essential Cotton Tee", "Kinfolk", "Best Seller", 28, 38, 4.4, 398, ["#1c1917", "#d4a72c", "#dc2626"]],
  ["cashmere-cardigan", "Cashmere Cardigan", "Forme", "Best Seller", 168, 220, 4.9, 156, ["#e7e0d4", "#d4a5a5"], "merino-crewneck-sweater"],
].map((r) => product(r as Row));

export const NEW_ARRIVALS = [
  merinoSweater,
  woolBlazer,
  ["pleated-midi-skirt", "Pleated Midi Skirt", "Kinfolk", "New", 78, 98, 4.3, 72, ["#556b2f", "#1c1917"]],
  ["leather-loafers", "Leather Loafers", "Meridian", "New", 148, 195, 4.8, 94, ["#c19a6b", "#8b4513"]],
].map((r) => product(r as Row));
