import type { Metadata } from "next";
import { Suspense } from "react";
import { getAccount } from "@/components/account/data";
import { ProfileForm } from "@/components/account/profile-form";
import { AccountSection, DemoNotice } from "@/components/account/ui";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Profile" };

export default function AccountProfilePage() {
  return (
    <Suspense fallback={<Skeleton className="h-[495px] w-full max-w-[498px]" />}>
      <Profile />
    </Suspense>
  );
}

async function Profile() {
  const { customer, demo } = await getAccount("/account/profile");
  return (
    <>
      {demo && <DemoNotice />}
      <AccountSection title="Profile Settings">
        <ProfileForm
          firstName={customer.firstName ?? ""}
          lastName={customer.lastName ?? ""}
          email={customer.emailAddress?.emailAddress ?? ""}
          phone={customer.phoneNumber?.phoneNumber ?? ""}
        />
      </AccountSection>
    </>
  );
}
