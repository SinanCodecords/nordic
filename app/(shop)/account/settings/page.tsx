import type { Metadata } from "next";
import { Suspense } from "react";
import { AccountSettings } from "@/components/account/account-settings";
import { getAccount } from "@/components/account/data";
import { AccountSection, DemoNotice } from "@/components/account/ui";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Settings" };

export default function AccountSettingsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-[640px] w-full max-w-[758px]" />}>
      <Settings />
    </Suspense>
  );
}

async function Settings() {
  const { demo } = await getAccount("/account/settings");
  return (
    <>
      {demo && <DemoNotice />}
      <AccountSection title="Account Settings">
        <AccountSettings />
      </AccountSection>
    </>
  );
}
