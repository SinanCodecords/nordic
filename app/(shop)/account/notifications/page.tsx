import type { Metadata } from "next";
import { Suspense } from "react";
import { getAccount } from "@/components/account/data";
import { NotificationSettings } from "@/components/account/notification-settings";
import { AccountSection, DemoNotice } from "@/components/account/ui";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Notifications" };

export default function AccountNotificationsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[451px] w-full max-w-[761px]" />}>
      <Notifications />
    </Suspense>
  );
}

async function Notifications() {
  const { customer, demo } = await getAccount("/account/notifications");
  return (
    <>
      {demo && <DemoNotice />}
      <AccountSection title="Notification Preferences">
        <NotificationSettings subscribed={customer.emailAddress?.marketingState === "SUBSCRIBED"} />
      </AccountSection>
    </>
  );
}
