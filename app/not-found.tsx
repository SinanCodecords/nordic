import type { Metadata } from "next";
import Link from "next/link";
import { HeaderSearch } from "@/components/layout/header-actions";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Page not found" };

// Not in the Figma file; the empty-state layout used by Cart, Compare and Track Order.
export default function NotFound() {
  return (
    <div className="content-width flex flex-col items-center py-24 text-center">
      <p className="font-heading text-7xl leading-none font-bold tracking-[-2px] text-muted-foreground/40 sm:text-8xl">
        404
      </p>
      <h1 className="pt-6 font-heading text-2xl leading-8 font-bold">Page not found</h1>
      <p className="max-w-md pt-2 text-base leading-6 tracking-[-0.31px] text-muted-foreground">
        The page you&apos;re looking for has moved or no longer exists. Try a search, or head back to the shop.
      </p>
      <HeaderSearch className="mt-6 w-full max-w-sm" />
      <div className="flex flex-wrap justify-center gap-3 pt-6">
        <Button asChild>
          <Link href="/">Back to Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/collections/new-arrivals">Shop New Arrivals</Link>
        </Button>
      </div>
    </div>
  );
}
