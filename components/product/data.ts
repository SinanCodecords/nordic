import { COLLECTIONS } from "@/components/collection/data";
import { COLORS } from "@/components/shared/colors";
import { getDemoProduct } from "@/components/shared/demo-products";
import type { ProductCardData } from "@/components/shared/product-card";

// What the product page shows. Real products come from Shopify (./from-shopify.ts).
// getProductDetail() builds demo details from the Figma file; Compare, Search and the wishlist still use it
// until those pages are connected.

export type ProductDetail = ProductCardData & {
  /** Shopify product ID (gid://shopify/Product/123). Missing on demo products; reviews need it. */
  id?: string;
  category: { label: string; href: string };
  images: string[];
  colors: { name: string; hex: string }[];
  /** Empty for one-size products, which hides the size picker. */
  sizes: string[];
  /** Units left. Under 10 shows "Only N left". */
  stock: number;
  /** Buyable variants. Empty on demo products, which can't be added to the bag. */
  variants: DetailVariant[];
  highlights: string[];
  description: string;
  specifications: [label: string, value: string][];
  materials: string;
  shipping: string;
  returns: string;
  related: ProductCardData[];
};

export type DetailVariant = {
  /** Shopify variant ID, what the cart adds. */
  id: string;
  color?: string;
  size?: string;
  available: boolean;
  /** Units left, or null when Shopify doesn't share stock counts. */
  quantity: number | null;
  price: ProductCardData["price"];
  compareAtPrice?: ProductCardData["price"];
};

const COLOR_NAMES = Object.fromEntries(Object.entries(COLORS).map(([name, hex]) => [hex, name]));

export const SHIPPING = "Free standard shipping over $50. Express options at checkout.";
export const RETURNS = "30-day free returns. Items must be unworn with tags attached.";

/**
 * Details shared by every product in a category. Used when a product leaves the Highlights, Specifications
 * or Materials boxes empty in Shopify, so each product doesn't need its own copy.
 */
export const CATEGORY_DEFAULTS: Record<
  string,
  Pick<ProductDetail, "sizes" | "highlights" | "description" | "specifications" | "materials">
> = {
  men: {
    sizes: ["S", "M", "L", "XL"],
    highlights: ["Premium natural fibres", "Regular, easy fit", "Reinforced seams", "Machine washable"],
    description: "A modern wardrobe staple, cut for everyday comfort and made to last season after season.",
    specifications: [["Fit", "Regular"], ["Material", "Cotton blend"], ["Care", "Machine wash cold"]],
    materials: "Responsibly sourced natural fibres, pre-washed for softness.",
  },
  women: {
    sizes: ["XS", "S", "M", "L"],
    highlights: ["Premium natural fibres", "Considered, relaxed fit", "Clean finished seams", "Easy to layer"],
    description: "A considered piece designed for life in motion, easy to dress up or down.",
    specifications: [["Fit", "Relaxed"], ["Material", "Natural blend"], ["Care", "Hand wash cold"]],
    materials: "Responsibly sourced natural fibres with a soft, breathable hand.",
  },
  shoes: {
    sizes: ["7", "8", "9", "10", "11"],
    highlights: ["Cushioned insole", "Grippy rubber outsole", "Breathable lining", "True to size"],
    description: "Footwear built for comfort and made for everyday, from morning commute to weekend miles.",
    specifications: [["Fit", "True to size"], ["Sole", "Rubber"], ["Care", "Wipe clean"]],
    materials: "Durable uppers with a cushioned footbed and natural rubber sole.",
  },
  accessories: {
    sizes: [],
    highlights: ["Premium materials", "Built to last", "Gift ready packaging", "1-year warranty"],
    description: "The finishing detail that completes the look, made with quality materials and careful finishing.",
    specifications: [["Size", "One size"], ["Care", "Wipe clean"], ["Warranty", "1 year"]],
    materials: "Quality materials selected for durability and a refined finish.",
  },
  electronics: {
    sizes: [],
    highlights: ["Long battery life", "Bluetooth 5.3", "Fast USB-C charging", "2-year warranty"],
    description: "Audio and tech essentials with clean design and dependable everyday performance.",
    specifications: [["Connectivity", "Bluetooth 5.3"], ["Charging", "USB-C"], ["Warranty", "2 years"]],
    materials: "Recycled aluminium and soft-touch finishes.",
  },
};

/** Figma's Silk Slip Dress page, plus extra photos where the design has them. */
const OVERRIDES: Record<string, Partial<ProductDetail>> = {
  "silk-slip-dress": {
    stock: 9,
    highlights: ["100% mulberry silk", "Bias cut for fluid drape", "Adjustable spaghetti straps", "French seams throughout"],
    description: "A bias-cut silk slip with an adjustable strap and a fluid drape that moves naturally with you.",
    specifications: [["Fit", "Relaxed"], ["Length", "Midi"], ["Material", "100% Silk"], ["Care", "Hand wash cold"]],
    materials: "Grade-A mulberry silk with a luminous charmeuse finish.",
  },
  "wireless-noise-cancel-headphones": {
    images: ["/images/products/wireless-noise-cancel-headphones.jpg", "/images/brand/black-headphones.png"],
  },
};

/** The first category collection (not New Arrivals) that lists the product. */
function categoryOf(handle: string) {
  const [key, collection] =
    Object.entries(COLLECTIONS).find(
      ([key, c]) => key !== "new-arrivals" && c.products.some((p) => p.handle === handle),
    ) ?? [];
  if (!key || !collection) return undefined;
  return { key, collection };
}

export function getProductDetail(handle: string): ProductDetail | undefined {
  const product = getDemoProduct(handle);
  const category = categoryOf(handle);
  if (!product || !category) return undefined;

  return {
    ...product,
    ...CATEGORY_DEFAULTS[category.key],
    category: { label: category.collection.title, href: `/collections/${category.key}` },
    images: [product.image],
    colors: product.swatches.map((hex) => ({ hex, name: COLOR_NAMES[hex] ?? hex })),
    stock: product.available === false ? 0 : 24,
    variants: [],
    shipping: SHIPPING,
    returns: RETURNS,
    related: category.collection.products.filter((p) => p.handle !== handle).slice(0, 4),
    ...OVERRIDES[handle],
  };
}
