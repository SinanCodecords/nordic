"use client";

import { Check, MapPin, Share2, ShoppingBag, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { Stars } from "@/components/shared/stars";
import { TrackRecentlyViewed, WishlistButton } from "@/components/wishlist/wishlist-button";
import { Button } from "@/components/ui/button";
import { discountPercent, formatPrice } from "@/lib/shopify/helpers";
import { cn } from "@/lib/utils";
import CustomInput from "~/form-elements/CustomInput";
import type { ProductDetail } from "./data";
import { SizeGuide } from "./size-guide";

type Props = { product: ProductDetail };

/** Right-hand column: title, price, colour/size/quantity pickers and the buy buttons. */
export function ProductInfo({ product }: Props) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const soldOut = product.stock === 0;
  const off = discountPercent(product.price, product.compareAtPrice ?? null);

  // TODO: when Shopify is connected, find the variant for the chosen colour + size and call
  // addItem(variantId, quantity) / buyNow(variantId, quantity) from components/cart/actions.
  const notConnected = () => toast("The cart isn't connected to Shopify yet.");

  return (
    <div className="flex flex-col gap-5">
      <TrackRecentlyViewed handle={product.handle} />
      <div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium tracking-[0.2px] text-muted-foreground uppercase">{product.vendor}</span>
          <ShareButton title={product.title} />
        </div>
        <h1 className="pt-1 type-page-title">{product.title}</h1>
        <div className="flex items-center gap-1.5 pt-2 type-label">
          <Stars value={product.rating} className="size-4 stroke-[1.5]" />
          <span>{product.rating}</span>
          <span className="type-body text-muted-foreground">({product.reviewCount})</span>
        </div>
      </div>

      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-heading text-2xl leading-8 font-semibold">{formatPrice(product.price)}</span>
        {product.compareAtPrice && off > 0 && (
          <>
            <s className="text-base text-muted-foreground">{formatPrice(product.compareAtPrice)}</s>
            <span className="type-label text-success">{off}% off</span>
          </>
        )}
      </p>

      <StockStatus stock={product.stock} />

      <hr className="border-muted" />

      {product.colors.length > 0 && (
        <fieldset>
          <legend className="text-sm leading-5 font-semibold">Color: {color.name}</legend>
          <div className="flex flex-wrap gap-2 pt-2">
            {product.colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                aria-label={`Select color ${c.name}`}
                aria-pressed={c.hex === color.hex}
                onClick={() => setColor(c)}
                className={cn(
                  "size-8 rounded-full border transition-[box-shadow]",
                  c.hex === color.hex && "ring-2 ring-selected ring-offset-2 ring-offset-background",
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </fieldset>
      )}

      {product.sizes.length > 0 && (
        <fieldset>
          <div className="flex items-center justify-between">
            <legend className="text-sm leading-5 font-semibold">Size: {size}</legend>
            <SizeGuide />
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === size}
                onClick={() => setSize(s)}
                className={cn(
                  "h-10 min-w-10 rounded-md border bg-field px-3 type-label transition-colors hover:border-selected",
                  s === size && "border-selected bg-selected text-background",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <p className="pb-2 text-sm leading-5 font-semibold">Quantity</p>
        <QuantitySelector value={quantity} onChange={setQuantity} max={product.stock} disabled={soldOut} />
      </div>

      <div className="flex gap-3">
        <Button size="lg" className="flex-1 px-8" disabled={soldOut} onClick={notConnected}>
          <ShoppingBag /> {soldOut ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button size="lg" variant="secondary" className="flex-1 px-8" disabled={soldOut} onClick={notConnected}>
          <Zap /> Buy Now
        </Button>
        <WishlistButton
          handle={product.handle}
          title={product.title}
          className="size-10 shrink-0"
          iconClassName="size-5 stroke-[1.5]"
        />
      </div>

      <hr className="border-muted" />

      <DeliveryCheck />

      <div>
        <h3 className="text-sm leading-5 font-semibold">Product Highlights</h3>
        <ul className="grid gap-x-2 gap-y-2 pt-3 sm:grid-cols-2">
          {product.highlights.map((h) => (
            <li key={h} className="flex gap-2 type-body">
              <Check className="mt-0.5 size-4 shrink-0 text-success" />
              {h}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StockStatus({ stock }: { stock: number }) {
  if (stock === 0) return <p className="type-label text-destructive">Out of Stock</p>;
  return (
    <p className="flex items-center gap-1.5 type-label text-success">
      <Check className="size-4" />
      In Stock{stock < 10 && ` · Only ${stock} left`}
    </p>
  );
}

function ShareButton({ title }: { title: string }) {
  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(url);
    toast("Link copied");
  };

  return (
    <button
      type="button"
      aria-label="Share this product"
      onClick={share}
      className="grid size-8 place-items-center rounded-md transition-colors hover:bg-accent"
    >
      <Share2 className="size-4" />
    </button>
  );
}

// TODO: connect to a delivery-date service. Until then it only confirms on screen.
function DeliveryCheck() {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="flex items-center gap-2 text-sm leading-5 font-semibold">
        <MapPin className="size-4" /> Delivery Options
      </h3>
      <form
        className="flex gap-2 pt-3"
        onSubmit={(e) => {
          e.preventDefault();
          toast("Delivery check isn't connected yet.");
        }}
      >
        <CustomInput
          name="pincode"
          required
          inputMode="numeric"
          aria-label="Pincode"
          placeholder="Enter pincode"
          wrapperClass="flex-1"
          className="h-9"
        />
        <Button type="submit" size="sm" className="h-9 text-xs">
          Check
        </Button>
      </form>
      <p className="pt-2 text-xs text-muted-foreground">Free shipping on orders over $50. 30-day free returns.</p>
    </div>
  );
}
