import { Package } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/** Figma "No orders to track". Logged-out visitors get a sign-in prompt in the same layout. */
export function OrderEmptyState({ signedIn, returnTo }: { signedIn: boolean; returnTo: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-20 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-elevated">
        <Package className="size-8 stroke-[1.5] text-muted-foreground" />
      </span>
      <h1 className="pt-4 font-heading text-2xl leading-8 font-bold">
        {signedIn ? "No orders to track" : "Track your orders"}
      </h1>
      <p className="pt-2 text-base leading-6 tracking-[-0.31px] text-muted-foreground">
        {signedIn
          ? "Place an order to see tracking information here."
          : "Sign in to see your orders and their delivery status. You can also use the link in your order confirmation email."}
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-6">
        {!signedIn && (
          <Button asChild>
            {/* A route handler (redirects to Shopify login), so a plain link, not next/link. */}
            <a href={`/account/login?next=${encodeURIComponent(returnTo)}`}>Sign In</a>
          </Button>
        )}
        <Button asChild variant={signedIn ? "default" : "outline"}>
          <Link href="/collections/new-arrivals">Start Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
