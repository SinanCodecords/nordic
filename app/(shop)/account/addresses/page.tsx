import { MapPin } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { AddAddressButton, AddressCardActions } from "@/components/account/address-actions";
import { getAccount } from "@/components/account/data";
import { AccountEmptyState, AccountSection, DemoNotice } from "@/components/account/ui";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Addresses" };

export default function AccountAddressesPage() {
  return (
    <Suspense fallback={<Skeleton className="h-60 w-full" />}>
      <Addresses />
    </Suspense>
  );
}

async function Addresses() {
  const { customer, demo } = await getAccount("/account/addresses");
  const addresses = customer.addresses.nodes;
  const defaultId = customer.defaultAddress?.id;

  return (
    <>
      {demo && <DemoNotice />}
      <AccountSection title="Saved Addresses" action={<AddAddressButton />}>
        {addresses.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => {
              const isDefault = address.id === defaultId;
              const name = [address.firstName, address.lastName].filter(Boolean).join(" ");
              return (
                <li key={address.id} className="rounded-lg border p-5">
                  <p className="flex items-center gap-2">
                    <span className="text-base leading-6 font-medium tracking-[-0.31px]">{name || "Address"}</span>
                    {isDefault && <span className="rounded-md bg-elevated px-2.5 py-0.5 type-badge">Default</span>}
                  </p>
                  <address className="pt-2 type-body text-muted-foreground not-italic">
                    {address.formatted.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                    {address.phoneNumber && <span className="block pt-1">{address.phoneNumber}</span>}
                  </address>
                  <AddressCardActions address={address} isDefault={isDefault} />
                </li>
              );
            })}
          </ul>
        ) : (
          <AccountEmptyState icon={MapPin} title="No saved addresses" text="Add an address to check out faster." />
        )}
      </AccountSection>
    </>
  );
}
