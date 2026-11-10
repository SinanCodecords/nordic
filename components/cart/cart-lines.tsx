import Image from "next/image";
import Link from "next/link";
import { type Cart, formatPrice } from "@/lib/shopify";
import { LineControls } from "./line-controls";

export function CartLines({ cart }: { cart: Cart }) {
  return (
    <ul aria-label="Items in your cart" className="divide-y border-y">
      {cart.lines.nodes.map((line) => {
        const { merchandise, cost } = line;
        const { product } = merchandise;
        const image = merchandise.image ?? product.featuredImage;
        const href = `/products/${product.handle}`;
        const compareAt = cost.compareAtAmountPerQuantity;

        return (
          <li key={line.id} className="flex gap-3 py-5 sm:gap-6">
            <Link
              href={href}
              className="relative size-20 shrink-0 overflow-hidden rounded-md border bg-elevated sm:size-28"
            >
              {image && (
                <Image
                  src={image.url}
                  alt={image.altText ?? product.title}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              )}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
              <div className="min-w-0 space-y-1">
                {product.vendor && (
                  <p className="text-[11px] leading-[14px] font-medium tracking-[0.3px] text-muted-foreground uppercase">
                    {product.vendor}
                  </p>
                )}
                <h3 className="type-product-title font-semibold">
                  <Link href={href} className="hover:underline">
                    {product.title}
                  </Link>
                </h3>
                {merchandise.title !== "Default Title" && (
                  <p className="type-body text-muted-foreground">{merchandise.title}</p>
                )}
                <p className="flex items-baseline gap-2 text-sm">
                  {formatPrice(cost.amountPerQuantity)}
                  {compareAt && Number(compareAt.amount) > Number(cost.amountPerQuantity.amount) && (
                    <s className="text-xs text-muted-foreground">{formatPrice(compareAt)}</s>
                  )}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 sm:flex-col sm:flex-nowrap sm:items-end">
                <p className="font-heading text-[15px] leading-[19px] font-bold">{formatPrice(cost.totalAmount)}</p>
                <LineControls lineId={line.id} quantity={line.quantity} />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
