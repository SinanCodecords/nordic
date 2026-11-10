import { Package } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getAccount } from "@/components/account/data";
import { AccountEmptyState, AccountSection, DemoNotice } from "@/components/account/ui";
import { OrderTrackingCard } from "@/components/orders";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Orders" };

export default function AccountOrdersPage() {
  return (
    <Suspense fallback={<Skeleton className="h-72 w-full" />}>
      <Orders />
    </Suspense>
  );
}

async function Orders() {
  const { customer, demo } = await getAccount("/account/orders");
  const orders = customer.orders.nodes;

  return (
    <>
      {demo && <DemoNotice />}
      <AccountSection title="My Orders">
        {orders.length ? (
          <div className="grid gap-6">
            {orders.map((order) => (
              <OrderTrackingCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <AccountEmptyState
            icon={Package}
            title="No orders yet"
            text="When you place orders, they'll appear here."
            action={{ label: "Start Shopping", href: "/collections/new-arrivals" }}
          />
        )}
      </AccountSection>
    </>
  );
}
