export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  createdAt: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: Image | null;
  images: Image[];
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
  options: {
    name: string;
    values: string[];
    /** `swatch.color` is set when the store picks a colour for the value in Shopify admin. */
    optionValues: { name: string; swatch: { color: string | null } | null }[];
  }[];
  variants: ProductVariant[];
  /** Same order as the fragment's identifiers; null when a product has no value. */
  metafields: (Metafield | null)[];
};

export type Metafield = { namespace: string; key: string; value: string };

export type Collection = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  description: string;
  image: Image | null;
};

type Edges<T> = { edges: { node: T }[] };

export type ShopifyProduct = Omit<Product, "images" | "variants"> & {
  images: Edges<Image>;
  variants: Edges<ProductVariant>;
};
