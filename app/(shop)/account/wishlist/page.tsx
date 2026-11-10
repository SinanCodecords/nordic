import { Heart } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getAccount, getWishlistProducts } from "@/components/account/data";
import { AccountEmptyState, AccountSection, DemoNotice } from "@/components/account/ui";
import { ProductCard } from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Wishlist" };

export default function AccountWishlistPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72 w-full" />}>
      <Wishlist />
    </Suspense>
  );
}

async function Wishlist() {
  const [{ demo }, products] = await Promise.all([getAccount("/account/wishlist"), getWishlistProducts()]);

  return (
    <>
      {demo && <DemoNotice />}
      <AccountSection title="Wishlist">
        {products.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((p) => (
              <ProductCard key={p.handle} product={p} imageClassName="h-[234px]" />
            ))}
          </div>
        ) : (
          <AccountEmptyState
            icon={Heart}
            title="Your wishlist is empty"
            text="Save items you love to find them here later."
            action={{ label: "Browse Products", href: "/collections/new-arrivals" }}
          />
        )}
      </AccountSection>
    </>
  );
}
