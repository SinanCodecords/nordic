import { Check, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ProductDetail } from "@/components/product";
import { Stars } from "@/components/shared/stars";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/shopify/helpers";
import { ClearCompare, RemoveFromCompare } from "./compare-controls";
import { MAX_COMPARE } from "./shared";

type Row = { label: string; cell: (p: ProductDetail) => ReactNode };

const ROWS: Row[] = [
  {
    label: "Price",
    cell: (p) => (
      <span className="flex items-baseline gap-2">
        <span className="font-heading font-semibold">{formatPrice(p.price)}</span>
        {p.compareAtPrice && <s className="text-xs text-muted-foreground">{formatPrice(p.compareAtPrice)}</s>}
      </span>
    ),
  },
  {
    label: "Rating",
    cell: (p) => (
      <span className="flex items-center gap-1.5">
        <Stars value={p.rating} />
        <span className="font-medium">{p.rating}</span>
        <span className="text-muted-foreground">({p.reviewCount})</span>
      </span>
    ),
  },
  {
    label: "Availability",
    cell: (p) =>
      p.stock > 0 ? (
        <span className="flex items-center gap-1 text-success">
          <Check className="size-4" /> In Stock
        </span>
      ) : (
        <span className="text-destructive">Out of Stock</span>
      ),
  },
  { label: "Brand", cell: (p) => p.vendor },
  {
    label: "Category",
    cell: (p) => (
      <Link href={p.category.href} className="underline-offset-4 hover:underline">
        {p.category.label}
      </Link>
    ),
  },
  {
    label: "Colors",
    cell: (p) => (
      <ul className="flex flex-wrap gap-1.5">
        {p.colors.map((c) => (
          <li key={c.hex} title={c.name} className="size-4 rounded-full border" style={{ backgroundColor: c.hex }}>
            <span className="sr-only">{c.name}</span>
          </li>
        ))}
      </ul>
    ),
  },
  { label: "Sizes", cell: (p) => (p.sizes.length ? p.sizes.join(", ") : "One size") },
];

/** Spec labels across all products (Fit, Material, Warranty…), in first-seen order. */
function specRows(products: ProductDetail[]): Row[] {
  const labels = [...new Set(products.flatMap((p) => p.specifications.map(([label]) => label)))];
  return labels.map((label) => ({
    label,
    cell: (p) => p.specifications.find(([l]) => l === label)?.[1] ?? <span className="text-muted-foreground">—</span>,
  }));
}

export function CompareTable({ products }: { products: ProductDetail[] }) {
  const rows = [...ROWS, ...specRows(products)];
  const free = MAX_COMPARE - products.length;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4 pt-4">
        <div>
          <h1 className="type-page-title">Compare Products</h1>
          <p className="pt-2 type-body text-muted-foreground">
            {products.length} of {MAX_COMPARE} products selected
          </p>
        </div>
        <ClearCompare />
      </div>

      <div className="mt-6 overflow-x-auto rounded-lg border">
        <table className="w-full min-w-[640px] table-fixed type-body">
          <colgroup>
            <col className="w-32 sm:w-44" />
            {products.map((p) => (
              <col key={p.handle} />
            ))}
            {free > 0 && <col />}
          </colgroup>

          <thead>
            <tr className="align-top">
              <th scope="col" className="sticky left-0 z-20 bg-background p-4 text-left">
                <span className="sr-only">Product</span>
              </th>
              {products.map((p) => (
                <th key={p.handle} scope="col" className="p-4 text-left font-normal">
                  <div className="relative aspect-square overflow-hidden rounded-md border bg-elevated">
                    <Image src={p.image} alt={p.title} fill sizes="260px" className="object-cover" />
                    <RemoveFromCompare handle={p.handle} title={p.title} />
                  </div>
                  <p className="pt-3 text-[11px] leading-[14px] font-medium tracking-[0.3px] text-muted-foreground uppercase">
                    {p.vendor}
                  </p>
                  <Link href={`/products/${p.handle}`} className="block pt-1 type-product-title font-semibold hover:underline">
                    {p.title}
                  </Link>
                  <Button asChild size="sm" className="mt-3 w-full">
                    <Link href={`/products/${p.handle}`}>View Product</Link>
                  </Button>
                </th>
              ))}
              {free > 0 && (
                <td className="p-4">
                  <Link
                    href="/collections/new-arrivals"
                    className="flex aspect-square flex-col items-center justify-center gap-2 rounded-md border border-dashed text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    <Plus className="size-6 stroke-[1.5]" />
                    <span className="type-label">Add product</span>
                  </Link>
                </td>
              )}
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-t bg-background odd:bg-elevated">
                <th scope="row" className="sticky left-0 z-20 bg-inherit px-4 py-3 text-left font-medium">
                  {row.label}
                </th>
                {products.map((p) => (
                  <td key={p.handle} className="px-4 py-3 text-foreground-secondary">
                    {row.cell(p)}
                  </td>
                ))}
                {free > 0 && <td />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
