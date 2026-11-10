import { Info, type LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** "My Orders", "Saved Addresses"… with an optional button on the right. */
export function AccountSection({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="flex min-h-8 items-center justify-between gap-4">
        <h2 className="type-ui-heading">{title}</h2>
        {action}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

/** Figma empty states inside account pages ("No orders yet", "Your wishlist is empty"). */
export function AccountEmptyState({
  icon: Icon,
  title,
  text,
  action,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border p-12 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-elevated">
        <Icon className="size-8 stroke-[1.5] text-muted-foreground" />
      </span>
      <h3 className="pt-4 text-lg leading-7 font-semibold tracking-[-0.44px]">{title}</h3>
      <p className="pt-1.5 type-body text-muted-foreground">{text}</p>
      {action && (
        <Button asChild className="mt-6">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}

/** Bordered box used by the profile, notifications and settings cards. */
export function AccountCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("rounded-lg border p-5 sm:p-6", className)}>{children}</div>;
}

/** Shown at the top of account pages while they use the Figma sample customer. */
export function DemoNotice() {
  return (
    <p className="mb-6 flex items-start gap-2 rounded-lg border border-dashed px-4 py-3 type-body text-muted-foreground">
      <Info className="mt-0.5 size-4 shrink-0" />
      Sample account from the design. Connect Shopify customer accounts to see real data here.
    </p>
  );
}
