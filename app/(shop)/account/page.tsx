import { Eye, Heart, MapPin, Package } from "lucide-react";
import { Suspense } from "react";
import { getAccount, getRecentlyViewed, getWishlistProducts } from "@/components/account/data";
import { AccountSection, DemoNotice } from "@/components/account/ui";
import { ProductCard } from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function AccountOverviewPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[480px] w-full" />}>
      <Overview />
    </Suspense>
  );
}

async function Overview() {
  const [{ customer, demo }, wishlist, recent] = await Promise.all([
    getAccount("/account"),
    getWishlistProducts(),
    getRecentlyViewed(),
  ]);
  const name = customer.firstName || customer.displayName;

  const stats = [
    { label: "Total Orders", value: customer.orders.nodes.length, icon: Package },
    { label: "Wishlist Items", value: wishlist.length, icon: Heart },
    { label: "Recently Viewed", value: recent.length, icon: Eye },
    { label: "Saved Addresses", value: customer.addresses.nodes.length, icon: MapPin },
  ];

  return (
    <>
      {demo && <DemoNotice />}

      <div className="rounded-lg border bg-linear-to-br from-elevated/50 to-transparent p-6">
        <h2 className="font-heading text-xl leading-7 font-semibold tracking-[-0.45px]">Welcome back, {name}</h2>
        <p className="pt-1 type-body text-muted-foreground">Here&apos;s what&apos;s happening with your account.</p>
      </div>

      <ul className="grid grid-cols-2 gap-4 pt-6 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <li key={label} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <Icon className="size-5 stroke-[1.5] text-muted-foreground" />
              <span className="font-heading text-2xl leading-8 font-bold">{value}</span>
            </div>
            <p className="pt-2 type-body text-muted-foreground">{label}</p>
          </li>
        ))}
      </ul>

      {recent.length > 0 && (
        <AccountSection title="Recently Viewed" className="pt-6">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {recent.slice(0, 3).map((p) => (
              <ProductCard key={p.handle} product={p} imageClassName="h-[234px]" />
            ))}
          </div>
        </AccountSection>
      )}
    </>
  );
}
