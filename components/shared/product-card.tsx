import { ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CompareButton } from "@/components/compare/compare-button";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { formatPrice } from "@/lib/shopify/helpers";
import type { Money } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";
import { Stars } from "./stars";

/** What a product card shows. Shaped like Shopify data so it can be swapped for real products later. */
export type ProductCardData = {
  handle: string;
  title: string;
  vendor: string;
  /** Empty when the product has no photo yet. */
  image: string;
  badge?: "Trending" | "New" | "Best Seller";
  price: Money;
  compareAtPrice?: Money;
  rating: number;
  reviewCount: number;
  swatches: string[];
  /** false when every variant is sold out (Shopify `availableForSale`). */
  available?: boolean;
  /** When the product was added in Shopify, for "Newest" sorting. */
  createdAt: string;
};

type ProductCardProps = {
  product: ProductCardData;
  /** "grid" stacks the image above the details; "list" puts them side by side. */
  layout?: "grid" | "list";
  /** Image area size, e.g. "h-[215px]". Defaults to the landing page size. */
  imageClassName?: string;
  preload?: boolean;
};

export function ProductCard({ product, layout = "grid", imageClassName = "h-[290px]", preload }: ProductCardProps) {
  const href = `/products/${product.handle}`;
  const soldOut = product.available === false;
  const list = layout === "list";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-lg border border-[#e4e4e7] bg-card dark:border-border",
        list && "flex",
      )}
    >
      <div className={cn("relative shrink-0 bg-elevated", list ? "w-36 sm:w-56" : imageClassName)}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            fill
            preload={preload}
            sizes={list ? "224px" : "(min-width: 1280px) 302px, (min-width: 640px) 50vw, 100vw"}
            className={cn(
              "object-cover transition-transform duration-500 group-hover:scale-[1.03]",
              soldOut && "opacity-60",
            )}
          />
        ) : (
          <NoImage />
        )}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span className="rounded bg-primary px-2.5 py-1 type-badge text-[11px] leading-[13px] text-primary-foreground">
              {product.badge}
            </span>
          )}
          {soldOut && (
            <span className="rounded border bg-overlay px-2.5 py-0.5 type-badge text-foreground backdrop-blur-sm">
              Out of Stock
            </span>
          )}
        </div>
        <WishlistButton
          handle={product.handle}
          title={product.title}
          className="absolute top-3 right-3 z-10 size-8 border-[#e4e4e7] dark:border-border"
        />
      </div>

      <div className={cn("space-y-2 p-4", list && "flex min-w-0 flex-1 flex-col justify-center sm:p-6")}>
        <div className="flex items-center justify-between text-[11px] leading-[14px] font-medium text-muted-foreground">
          <span className="tracking-[0.3px] uppercase">{product.vendor}</span>
          <CompareButton handle={product.handle} title={product.title} />
        </div>

        <h3 className="truncate type-product-title font-semibold">
          <Link href={href} className="after:absolute after:inset-0">
            {product.title}
          </Link>
        </h3>

        <Rating value={product.rating} count={product.reviewCount} />

        <div className="flex items-center justify-between">
          <p className="flex items-baseline gap-2">
            <span className="font-heading text-[15px] leading-[19px] font-bold">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <s className="text-[13px] text-muted-foreground">{formatPrice(product.compareAtPrice)}</s>
            )}
          </p>
          <ul className="flex gap-1" aria-label="Colours">
            {product.swatches.map((color) => (
              <li
                key={color}
                className="size-3 rounded-full border border-[#e4e4e7] dark:border-border"
                style={{ backgroundColor: color }}
              />
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function Rating({ value, count }: { value: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs leading-4">
      <Stars value={value} />
      {count > 0 ? (
        <>
          <span className="font-medium">{value}</span>
          <span className="text-muted-foreground">({count})</span>
        </>
      ) : (
        <span className="text-muted-foreground">No reviews yet</span>
      )}
    </div>
  );
}

/** Shown when a product has no photo in Shopify yet. */
export function NoImage({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 grid place-items-center text-muted-foreground/50", className)}>
      <ImageOff className="size-8 stroke-[1.25]" aria-label="No photo yet" />
    </div>
  );
}
