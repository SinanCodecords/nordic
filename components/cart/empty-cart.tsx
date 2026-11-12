import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Figma "Empty State / Your cart is empty". */
export function EmptyCart() {
  return (
    <div className="flex flex-col items-center px-6 py-20 text-center">
      <span className="mb-4 grid size-16 place-items-center rounded-full bg-elevated">
        <ShoppingBag className="size-8 stroke-[1.5] text-muted-foreground" />
      </span>
      <h2 className="text-lg leading-7 font-semibold tracking-[-0.44px]">Your cart is empty</h2>
      <p className="max-w-96 pt-1.5 type-body text-muted-foreground">
        Looks like you haven&apos;t added anything yet. Explore our collection and find something you love.
      </p>
      <Button asChild className="mt-6">
        <Link href="/collections/all">Browse Products</Link>
      </Button>
    </div>
  );
}
