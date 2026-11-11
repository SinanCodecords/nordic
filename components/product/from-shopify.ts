import { saleFrom, toProductCard } from "@/components/shared/from-shopify";
import { colorHex } from "@/components/shared/colors";
import { metafield, metafieldList, optionValues, variantOption } from "@/lib/shopify/helpers";
import type { Product } from "@/lib/shopify/types";
import { CATEGORY_DEFAULTS, type DetailVariant, type ProductDetail, RETURNS, SHIPPING } from "./data";

/** "Material: 100% Silk" → ["Material", "100% Silk"]. A line without a colon keeps an empty value. */
function toSpec(line: string): [string, string] {
  const i = line.indexOf(":");
  return i > 0 ? [line.slice(0, i).trim(), line.slice(i + 1).trim()] : [line.trim(), ""];
}

/**
 * A Shopify product as the product page needs it. The product type (Men, Women, Shoes…) picks the
 * breadcrumb collection and the category text used when Highlights, Specifications or Materials are empty.
 */
export function toProductDetail(
  product: Product,
  { related, stock }: { related: Product[]; stock: Record<string, number | null> | null },
): ProductDetail {
  const type = product.productType.trim();
  const defaults = CATEGORY_DEFAULTS[type.toLowerCase()];

  const variants: DetailVariant[] = product.variants.map((v) => ({
    id: v.id,
    color: variantOption(v, "color", "colour"),
    size: variantOption(v, "size"),
    available: v.availableForSale,
    quantity: stock?.[v.id] ?? null,
    price: v.price,
    compareAtPrice: saleFrom(v.price, v.compareAtPrice),
  }));
  const counts = variants.map((v) => (v.available ? v.quantity : 0));
  const highlights = metafieldList(product, "custom", "highlights");
  const specifications = metafieldList(product, "custom", "specifications").map(toSpec);
  const images = product.images.length ? product.images : product.featuredImage ? [product.featuredImage] : [];

  return {
    ...toProductCard(product),
    id: product.id,
    category: type
      ? { label: type, href: `/collections/${type.toLowerCase().replace(/\s+/g, "-")}` }
      : { label: "New Arrivals", href: "/collections/new-arrivals" },
    images: images.map((image) => image.url),
    colors: optionValues(product, "color", "colour").map((v) => ({ name: v.name, hex: colorHex(v.name, v.swatch?.color) })),
    sizes: optionValues(product, "size").map((v) => v.name),
    // Total units left; without stock counts, in stock is all we know.
    stock: !product.availableForSale ? 0 : counts.every((n) => n !== null) ? counts.reduce<number>((a, n) => a + (n ?? 0), 0) : 99,
    variants,
    highlights: highlights.length ? highlights : (defaults?.highlights ?? []),
    description: product.description || defaults?.description || "",
    specifications: specifications.length ? specifications : (defaults?.specifications ?? []),
    materials: metafield(product, "custom", "materials") || defaults?.materials || "",
    shipping: SHIPPING,
    returns: RETURNS,
    related: related.filter((p) => p.handle !== product.handle).slice(0, 4).map(toProductCard),
  };
}
