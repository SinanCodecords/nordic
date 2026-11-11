import { COLLECTIONS } from "@/components/collection/data";
import { getDemoProduct } from "@/components/shared/demo-products";
import type { ProductCardData } from "@/components/shared/product-card";

// Demo product details built from the Figma file, used until the Shopify store is connected.
// Replace getProductDetail() with Shopify's `product(handle:)` query (lib/shopify) later:
// images, options (Color / Size), variants and description all come from there.

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
  highlights: string[];
  description: string;
  specifications: [label: string, value: string][];
  materials: string;
  shipping: string;
  returns: string;
  related: ProductCardData[];
};

const COLOR_NAMES: Record<string, string> = {
  "#f5f5f4": "Ivory",
  "#d6d3d1": "Stone",
  "#a8a29e": "Silver",
  "#1e3a5f": "Navy",
  "#6b8cae": "Light Wash",
  "#1c1917": "Black",
  "#e6d7c1": "Champagne",
  "#44403c": "Charcoal",
  "#c19a6b": "Camel",
  "#d4a72c": "Gold",
  "#dc2626": "Red",
  "#c3b091": "Khaki",
  "#e7e0d4": "Oat",
  "#d4a5a5": "Blush",
  "#556b2f": "Olive",
  "#a16207": "Tan",
  "#f9a8d4": "Pink",
  "#8b4513": "Brown",
  "#c0c0c0": "Grey",
  "#f97316": "Orange",
  "#3b5b8c": "Blue",
};

const SHIPPING = "Free standard shipping over $50. Express options at checkout.";
const RETURNS = "30-day free returns. Items must be unworn with tags attached.";

/** Details shared by every product in a category, so each demo product doesn't need its own copy. */
const CATEGORY_DEFAULTS: Record<
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
    shipping: SHIPPING,
    returns: RETURNS,
    related: category.collection.products.filter((p) => p.handle !== handle).slice(0, 4),
    ...OVERRIDES[handle],
  };
}
