import type { ProductCardData } from "@/components/shared/product-card";

// What the product page, Compare and the wishlist show. Built from Shopify products in ./from-shopify.ts.

export type ProductDetail = ProductCardData & {
  /** Shopify product ID (gid://shopify/Product/123). Reviews need it. */
  id: string;
  category: { label: string; href: string };
  images: string[];
  colors: { name: string; hex: string }[];
  /** Empty for one-size products, which hides the size picker. */
  sizes: string[];
  /** Units left. Under 10 shows "Only N left". */
  stock: number;
  /** Each colour + size combination, which is what the cart adds. */
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
