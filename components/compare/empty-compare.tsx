import { GitCompareArrows } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Figma "Empty State / No products to compare". */
export function EmptyCompare() {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <span className="mb-4 grid size-16 place-items-center rounded-full bg-elevated">
        <GitCompareArrows className="size-8 stroke-[1.5] text-muted-foreground" />
      </span>
      <h1 className="text-lg leading-7 font-semibold tracking-[-0.44px]">No products to compare</h1>
      <p className="max-w-96 pt-1.5 type-body text-muted-foreground">
        Add products to compare by clicking the &apos;Compare&apos; link on any product card. You can compare up to 4
        products at once.
      </p>
      <Button asChild className="mt-6">
        <Link href="/collections/new-arrivals">Browse Products</Link>
      </Button>
    </div>
  );
}
