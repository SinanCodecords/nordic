import { defaultVariant, discountPercent, optionValues, productRating } from "@/lib/shopify/helpers";
import type { Money, Product } from "@/lib/shopify/types";
import { colorHex } from "./colors";
import type { ProductCardData } from "./product-card";

/** Product tags that show as the card badge (set in Shopify admin → product → Tags). */
const BADGES = ["Best Seller", "Trending", "New"] as const;

/** The compare-at price, only when it's really higher (Shopify allows any value). */
export const saleFrom = (price: Money, compareAt: Money | null) =>
  discountPercent(price, compareAt) > 0 ? (compareAt ?? undefined) : undefined;

/** A Shopify product as a product card. */
export function toProductCard(product: Product): ProductCardData {
  const variant = defaultVariant(product);
  const price = variant?.price ?? product.priceRange.minVariantPrice;

  return {
    handle: product.handle,
    title: product.title,
    vendor: product.vendor,
    image: product.featuredImage?.url ?? "",
    badge: BADGES.find((badge) => product.tags.includes(badge)),
    price,
    compareAtPrice: saleFrom(price, variant?.compareAtPrice ?? null),
    ...productRating(product),
    swatches: optionValues(product, "color", "colour").map((v) => colorHex(v.name, v.swatch?.color)),
    available: product.availableForSale,
  };
}
