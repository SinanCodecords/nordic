import type { ProductCardData } from "./product-card";

// Placeholder products from the Figma file, used until the Shopify store is connected.
// Swap each list for real collection data (e.g. getCollectionProducts("new-arrivals")) later.

const usd = (amount: number) => ({ amount: amount.toFixed(2), currencyCode: "USD" });

type Row = [
  handle: string,
  title: string,
  vendor: string,
  badge: ProductCardData["badge"],
  price: number,
  compareAt: number,
  rating: number,
  reviews: number,
  swatches: string[],
  image?: string,
];

const ROWS: Row[] = [
  ["structured-cotton-oxford-shirt", "Structured Cotton Oxford Shirt", "Northwind", "Trending", 68, 89, 4.6, 214, ["#f5f5f4", "#d6d3d1", "#a8a29e"]],
  ["relaxed-selvedge-denim", "Relaxed Selvedge Denim", "Atlas", "Trending", 88, 110, 4.5, 142, ["#1e3a5f", "#6b8cae"]],
  ["tailored-wool-blazer", "Tailored Wool Blazer", "Meridian", "New", 198, 260, 4.7, 89, ["#1c1917", "#f5f5f4"]],
  ["silk-slip-dress", "Silk Slip Dress", "Cove", "Trending", 142, 185, 4.6, 127, ["#e6d7c1", "#1c1917"]],
  ["merino-crewneck-sweater", "Merino Crewneck Sweater", "Forme", "Best Seller", 94, 120, 4.8, 186, ["#44403c", "#c19a6b"]],
  ["essential-cotton-tee", "Essential Cotton Tee", "Kinfolk", "Best Seller", 28, 38, 4.4, 398, ["#1c1917", "#d4a72c", "#dc2626"]],
  ["relaxed-chino-pants", "Relaxed Chino Pants", "Kinfolk", "Trending", 68, 88, 4.3, 110, ["#c3b091", "#1e3a5f"], "pleated-midi-skirt"],
  ["cashmere-cardigan", "Cashmere Cardigan", "Forme", "Best Seller", 168, 220, 4.9, 156, ["#e7e0d4", "#d4a5a5"], "merino-crewneck-sweater"],
  ["pleated-midi-skirt", "Pleated Midi Skirt", "Kinfolk", "New", 78, 98, 4.3, 72, ["#556b2f", "#1c1917"]],
  ["stride-runner-sneakers", "Stride Runner Sneakers", "Stride", "Best Seller", 128, 160, 4.7, 312, ["#f5f5f4", "#1c1917", "#1e3a5f"]],
  ["court-classic-sneakers", "Court Classic Sneakers", "Stride", "Trending", 88, 115, 4.5, 248, ["#f5f5f4", "#a16207", "#f9a8d4"]],
  ["leather-loafers", "Leather Loafers", "Meridian", "New", 148, 195, 4.8, 94, ["#c19a6b", "#8b4513"]],
  ["knit-slip-on-mules", "Knit Slip-On Mules", "Cove", "New", 72, 95, 4.2, 63, ["#e7e0d4", "#c0c0c0"]],
  ["structured-tote-handbag", "Structured Tote Handbag", "Cove", "Trending", 158, 210, 4.6, 143, ["#dc2626", "#f5f5f4", "#f9a8d4"]],
  ["automatic-wristwatch", "Automatic Wristwatch", "Meridian", "Best Seller", 348, 450, 4.9, 201, ["#a8a29e", "#1e3a5f", "#a16207"]],
  ["pearl-layering-necklace", "Pearl Layering Necklace", "Cove", "Trending", 48, 65, 4.5, 89, ["#d4a72c"]],
  ["leather-weekender-bag", "Leather Weekender Bag", "Atlas", "Best Seller", 228, 290, 4.8, 117, ["#8b4513", "#1c1917"]],
  ["minimalist-leather-wallet", "Minimalist Leather Wallet", "Atlas", "Best Seller", 58, 78, 4.6, 234, ["#8b4513", "#1c1917"]],
  ["polarized-sunglasses", "Polarized Sunglasses", "Lumen", "New", 98, 130, 4.4, 178, ["#8b4513", "#1c1917"]],
  ["quilted-liner-jacket", "Quilted Liner Jacket", "Northwind", "New", 118, 150, 4.5, 88, ["#556b2f", "#1c1917"], "essential-cotton-tee"],
  ["sport-trail-runners", "Sport Trail Runners", "Stride", "New", 108, 140, 4.4, 156, ["#f97316", "#3b5b8c"]],
  ["wireless-noise-cancel-headphones", "Wireless Noise-Cancel Headphones", "Lumen", "Best Seller", 248, 320, 4.8, 426, ["#f5f5f4", "#1c1917"]],
  ["true-wireless-earbuds", "True Wireless Earbuds", "Lumen", "Trending", 128, 170, 4.5, 312, ["#f5f5f4", "#1c1917"]],
  ["portable-bluetooth-speaker", "Portable Bluetooth Speaker", "Lumen", "Best Seller", 88, 120, 4.6, 275, ["#1c1917", "#f5f5f4"]],
];

const SOLD_OUT = new Set(["knit-slip-on-mules"]);

const PRODUCTS = new Map(
  ROWS.map(([handle, title, vendor, badge, price, compareAt, rating, reviewCount, swatches, image = handle]) => [
    handle,
    {
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
      available: !SOLD_OUT.has(handle),
    } satisfies ProductCardData,
  ]),
);

export function pickProducts(...handles: string[]): ProductCardData[] {
  return handles.map((handle) => {
    const product = PRODUCTS.get(handle);
    if (!product) throw new Error(`Unknown demo product: ${handle}`);
    return product;
  });
}
