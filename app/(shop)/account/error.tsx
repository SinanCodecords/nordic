"use client";

import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { Button } from "@/components/ui/button";

/**
 * Shown when Shopify can't return the account (e.g. a permission is missing in the Customer Account API
 * settings). The real message is in the server logs; shoppers get a way out instead of a blank error page.
 */
export default function AccountError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center rounded-lg border px-6 py-14 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-elevated">
        <CircleAlert className="size-7 stroke-[1.5] text-muted-foreground" />
      </span>
      <h2 className="pt-4 text-lg leading-7 font-semibold tracking-[-0.44px]">We couldn&apos;t load your account</h2>
      <p className="max-w-96 pt-1.5 type-body text-muted-foreground">
        Something went wrong on our side. Please try again, or sign out and sign back in.
      </p>
      <div className="flex flex-wrap justify-center gap-3 pt-6">
        <Button onClick={() => startTransition(() => (router.refresh(), reset()))}>Try Again</Button>
        <form action="/account/logout" method="post">
          <Button type="submit" variant="outline">
            Sign Out
          </Button>
        </form>
      </div>
      {error.digest && <p className="pt-6 text-xs text-muted-foreground">Error code: {error.digest}</p>}
    </div>
  );
}
