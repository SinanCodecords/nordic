import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { CartLines, CartSummary, EmptyCart } from "@/components/cart";
import { getHomeSection } from "@/components/home";
import { ProductCard } from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCart } from "@/lib/shopify";
import CustomBreadcrumb from "~/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Cart",
  robots: { index: false },
};

export default async function CartPage() {
  // "Popular Right Now": the Best Sellers collection, or Shopify's best sellers until it has products.
  const popular = await getHomeSection("best-sellers", { sortKey: "BEST_SELLING", viewAllHref: "/collections/all" });

  return (
    <div className="content-width pt-9 pb-24">
      <CustomBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Cart", isCurrentPage: true }]}
        currentClassName="font-medium"
      />

      <Suspense fallback={<CartSkeleton />}>
        <CartContents />
      </Suspense>

      {popular.products.length > 0 && (
        <section className="pt-12">
          <h2 className="type-section-heading">Popular Right Now</h2>
          <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {popular.products.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// Reads the cart cookie, so it streams in after the static parts of the page.
async function CartContents() {
  const cart = await getCart().catch((error) => {
    // Let Next handle its own signals (e.g. cookies() during the build), log real failures.
    unstable_rethrow(error);
    console.error(error);
    return null;
  });
  if (!cart || cart.lines.nodes.length === 0) return <EmptyCart />;

  return (
    <>
      <h1 className="pt-4 type-page-title">Shopping Cart</h1>
      <div className="grid items-start gap-8 pt-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <CartLines cart={cart} />
          <Link
            href="/collections/all"
            className="mt-5 inline-flex items-center gap-1.5 type-label text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Continue Shopping
          </Link>
        </div>
        <CartSummary cart={cart} />
      </div>
    </>
  );
}

function CartSkeleton() {
  return (
    <div className="grid gap-8 pt-6 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <Skeleton className="h-80 w-full" />
    </div>
  );
}
