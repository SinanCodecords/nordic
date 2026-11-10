import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderEmptyState, OrderTrackingCard } from "@/components/orders";
import { Skeleton } from "@/components/ui/skeleton";
import { getCustomer, isLoggedIn } from "@/lib/shopify/customer";
import CustomBreadcrumb from "~/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Track Order",
  robots: { index: false },
};

export default function TrackOrderPage() {
  return (
    <div className="content-width pt-9 pb-24">
      <CustomBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Track Order", isCurrentPage: true }]}
        currentClassName="font-medium"
      />
      <Suspense fallback={<OrdersSkeleton />}>
        <TrackOrderContents />
      </Suspense>
    </div>
  );
}

// Reads the login cookie, so it streams in after the breadcrumb.
async function TrackOrderContents() {
  if (!(await isLoggedIn())) return <OrderEmptyState signedIn={false} returnTo="/track-order" />;

  const customer = await getCustomer().catch((error) => {
    console.error(error);
    return null;
  });
  const orders = customer?.orders.nodes ?? [];
  if (!orders.length) return <OrderEmptyState signedIn returnTo="/track-order" />;

  return (
    <>
      <h1 className="pt-4 type-page-title">Track Order</h1>
      <p className="pt-2 type-body text-muted-foreground">Delivery status for your recent orders.</p>
      <div className="grid gap-6 pt-6">
        {orders.map((order) => (
          <OrderTrackingCard key={order.id} order={order} />
        ))}
      </div>
    </>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4 pt-6">
      <Skeleton className="h-9 w-56" />
      <Skeleton className="h-56 w-full" />
    </div>
  );
}
