import { Heart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/shopify/helpers";
import type { Money } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

/** What a product card shows. Shaped like Shopify data so it can be swapped for real products later. */
export type ProductCardData = {
  handle: string;
  title: string;
  vendor: string;
  image: string;
  badge?: "Trending" | "New" | "Best Seller";
  price: Money;
  compareAtPrice?: Money;
  rating: number;
  reviewCount: number;
  swatches: string[];
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const href = `/products/${product.handle}`;

  return (
    <article className="group relative overflow-hidden rounded-lg border border-[#e4e4e7] bg-card dark:border-border">
      <div className="relative h-[290px] bg-elevated">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 302px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 rounded bg-primary px-2.5 py-1 type-badge text-[11px] leading-[13px] text-primary-foreground">
            {product.badge}
          </span>
        )}
        <button
          type="button"
          aria-label={`Add ${product.title} to wishlist`}
          className="absolute top-3 right-3 z-10 grid size-8 place-items-center rounded-full border border-[#e4e4e7] bg-overlay text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground dark:border-border"
        >
          <Heart className="size-4" />
        </button>
      </div>

      <div className="space-y-2 p-4">
        <div className="flex justify-between text-[11px] leading-[14px] font-medium text-muted-foreground">
          <span className="tracking-[0.3px] uppercase">{product.vendor}</span>
          <button type="button" className="relative z-10 hover:text-foreground">
            Compare
          </button>
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
      <span className="flex gap-0.5" role="img" aria-label={`Rated ${value} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn("size-3 stroke-2", i <= Math.floor(value) ? "text-star" : "text-[#e4e4e7] dark:text-border")}
          />
        ))}
      </span>
      <span className="font-medium">{value}</span>
      <span className="text-muted-foreground">({count})</span>
    </div>
  );
}
