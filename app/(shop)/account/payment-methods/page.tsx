import { CreditCard, Plus } from "lucide-react";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getAccount } from "@/components/account/data";
import { DemoButton } from "@/components/account/demo-button";
import { AccountEmptyState, AccountSection, DemoNotice } from "@/components/account/ui";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = { title: "Payment Methods" };

// Shopify keeps saved cards inside its own checkout (Shop Pay) and doesn't share them with the
// storefront, so these are the Figma sample cards, shown only on the demo account.
const DEMO_CARDS = [
  { brand: "Visa", last4: "4242", name: "Alex Morgan", expires: "08/28" },
  { brand: "Mastercard", last4: "8888", name: "Alex Morgan", expires: "03/27" },
];

const CARDS_MESSAGE = "Cards are saved securely at Shopify checkout and can't be managed here yet.";

export default function AccountPaymentMethodsPage() {
  return (
    <Suspense fallback={<Skeleton className="h-60 w-full" />}>
      <PaymentMethods />
    </Suspense>
  );
}

async function PaymentMethods() {
  const { demo } = await getAccount("/account/payment-methods");
  const cards = demo ? DEMO_CARDS : [];

  return (
    <>
      {demo && <DemoNotice />}
      <AccountSection
        title="Payment Methods"
        action={
          <DemoButton size="sm" className="text-xs" message={CARDS_MESSAGE}>
            <Plus /> Add Card
          </DemoButton>
        }
      >
        {cards.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {cards.map((card) => (
              <li key={card.last4} className="rounded-lg border p-5">
                <div className="flex items-center justify-between">
                  <CreditCard className="size-7 stroke-[1.5]" />
                  <span className="rounded-md bg-elevated px-2.5 py-0.5 type-badge">{card.brand}</span>
                </div>
                <p className="pt-4 text-lg leading-7 font-semibold tracking-[0.46px]">•••• •••• •••• {card.last4}</p>
                <p className="flex justify-between pt-3 type-body text-muted-foreground">
                  <span>{card.name}</span>
                  <span>Expires {card.expires}</span>
                </p>
                <div className="flex gap-2 pt-4">
                  <DemoButton size="sm" className="text-xs" message={CARDS_MESSAGE}>
                    Edit
                  </DemoButton>
                  <DemoButton
                    size="sm"
                    variant="ghost"
                    className="text-xs text-destructive hover:text-destructive"
                    message={CARDS_MESSAGE}
                  >
                    Remove
                  </DemoButton>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <AccountEmptyState
            icon={CreditCard}
            title="No saved cards"
            text="Cards you save at checkout are stored securely by Shopify and filled in for you next time."
          />
        )}
      </AccountSection>
    </>
  );
}
