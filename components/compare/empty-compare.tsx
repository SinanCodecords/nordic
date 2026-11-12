import { ArrowLeftRight, Check, GitCompareArrows, Search } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { comparePill, MAX_COMPARE } from "./shared";

/** Figma "Empty State / No products to compare", plus a short guide to finding the Compare button. */
export function EmptyCompare() {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <span className="mb-4 grid size-16 place-items-center rounded-full bg-elevated">
        <GitCompareArrows className="size-8 stroke-[1.5] text-muted-foreground" />
      </span>
      <h1 className="text-lg leading-7 font-semibold tracking-[-0.44px]">No products to compare</h1>
      <p className="max-w-96 pt-1.5 type-body text-muted-foreground">
        Add products to compare by clicking the &apos;Compare&apos; button on any product card. You can compare up to{" "}
        {MAX_COMPARE} products at once.
      </p>
      <Button asChild className="mt-6">
        <Link href="/collections/all">Browse Products</Link>
      </Button>

      <section aria-labelledby="how-to-compare" className="mt-16 w-full max-w-4xl">
        <h2 id="how-to-compare" className="type-eyebrow text-muted-foreground">
          How to compare
        </h2>
        <ol className="mt-4 grid gap-4 text-left sm:grid-cols-3">
          <Step number={1} title="Find a product" visual={<FindVisual />}>
            Open any collection or search for what you&apos;re after.
          </Step>
          <Step number={2} title="Click “Compare”" visual={<CardVisual />}>
            It&apos;s next to the brand name on every product card. It turns into “Comparing” once added.
          </Step>
          <Step number={3} title="See them side by side" visual={<TableVisual />}>
            Add up to {MAX_COMPARE} products, then come back here (or click “View” on the pop-up).
          </Step>
        </ol>
      </section>
    </div>
  );
}

function Step({
  number,
  title,
  visual,
  children,
}: {
  number: number;
  title: string;
  visual: ReactNode;
  children: ReactNode;
}) {
  return (
    <li className="overflow-hidden rounded-lg border bg-card">
      <div aria-hidden="true" className="grid h-32 place-items-center bg-elevated">
        {visual}
      </div>
      <div className="space-y-1 p-4">
        <p className="flex items-center gap-2 type-label">
          <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
            {number}
          </span>
          {title}
        </p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}

function FindVisual() {
  return (
    <span className="flex w-40 items-center gap-2 rounded-md border bg-card px-3 py-2 text-xs text-muted-foreground">
      <Search className="size-3.5" /> Search products…
    </span>
  );
}

// A mini product card with the Compare pill circled, so shoppers know what to look for.
function CardVisual() {
  return (
    <span className="w-40 overflow-hidden rounded-md border bg-card">
      <span className="block h-12 bg-muted" />
      <span className="flex items-center justify-between gap-2 p-2">
        <span className="text-[9px] font-medium tracking-[0.3px] text-muted-foreground uppercase">Brand</span>
        <span className={cn(comparePill, "bg-card ring-2 ring-primary ring-offset-2 ring-offset-card")}>
          <ArrowLeftRight className="size-3" /> Compare
        </span>
      </span>
      <span className="mx-2 mb-2 block h-2 w-20 rounded-full bg-muted" />
    </span>
  );
}

function TableVisual() {
  return (
    <span className="flex gap-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-12 space-y-1.5 rounded-md border bg-card p-1.5">
          <span className="block h-8 rounded-sm bg-muted" />
          <span className="block h-1.5 rounded-full bg-muted" />
          <span className="block h-1.5 w-2/3 rounded-full bg-muted" />
          <Check className="size-3 text-success" />
        </span>
      ))}
    </span>
  );
}
