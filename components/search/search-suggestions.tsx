"use client";

import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { NoImage } from "@/components/shared/product-card";
import type { Suggestions } from "@/lib/shopify/search";
import { formatPrice } from "@/lib/shopify/helpers";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  query: string;
  suggestions: Suggestions;
  /** Called when the shopper follows a suggestion, to close the box (and the mobile menu). */
  onPick: () => void;
  className?: string;
};

const searchHref = (q: string) => `/search?q=${encodeURIComponent(q)}`;
const row = "flex items-center gap-3 rounded-md px-3 py-2 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none";

/** The drop-down under the search box: search phrases, collections and products from Shopify. */
export function SearchSuggestions({ id, query, suggestions, onPick, className }: Props) {
  const { queries, collections, products } = suggestions;
  const phrases = queries.filter((q) => q.toLowerCase() !== query.toLowerCase()).slice(0, 3);

  return (
    <div
      id={id}
      className={cn(
        "absolute inset-x-0 top-full z-50 mt-2 max-h-[min(70dvh,560px)] min-w-[320px] overflow-y-auto rounded-lg border bg-popover p-2 text-popover-foreground shadow-lg",
        className,
      )}
    >
      {phrases.length > 0 && (
        <ul aria-label="Suggested searches">
          {phrases.map((phrase) => (
            <li key={phrase}>
              <Link href={searchHref(phrase)} onClick={onPick} className={cn(row, "type-body")}>
                <Search className="size-4 shrink-0 text-muted-foreground" />
                {phrase}
              </Link>
            </li>
          ))}
        </ul>
      )}

      {collections.length > 0 && (
        <div className="px-3 py-2">
          <p className="pb-2 type-eyebrow text-muted-foreground">Collections</p>
          <ul className="flex flex-wrap gap-2">
            {collections.map((c) => (
              <li key={c.handle}>
                <Link
                  href={`/collections/${c.handle}`}
                  onClick={onPick}
                  className="block rounded-full border px-3 py-1 type-label transition-colors hover:bg-accent"
                >
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {products.length > 0 ? (
        <div className="pt-1">
          <p className="px-3 py-2 type-eyebrow text-muted-foreground">Products</p>
          <ul>
            {products.map((p) => (
              <li key={p.handle}>
                <Link href={`/products/${p.handle}`} onClick={onPick} className={row}>
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-md border bg-elevated">
                    {p.image ? (
                      <Image src={p.image.url} alt="" fill sizes="44px" className="object-cover" />
                    ) : (
                      <NoImage className="[&_svg]:size-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{p.title}</span>
                    <span className="block text-xs text-muted-foreground uppercase">{p.vendor}</span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold">{formatPrice(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="px-3 py-4 type-body text-muted-foreground">No products match &ldquo;{query}&rdquo; yet.</p>
      )}

      <Link
        href={searchHref(query)}
        onClick={onPick}
        className={cn(row, "mt-1 justify-between border-t pt-3 type-label")}
      >
        See all results for &ldquo;{query}&rdquo;
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}
