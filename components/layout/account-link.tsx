import { User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { customerAccountsEnabled, isLoggedIn } from "@/lib/shopify/customer";
import { cn } from "@/lib/utils";

const iconLink = "relative grid size-9 place-items-center rounded-full border transition-colors hover:bg-accent";

/**
 * The person icon in the header. Signed out, it starts Shopify login; signed in, it opens My Account and shows
 * a green dot. It reads the login cookie, so it streams in after the (prerendered) header.
 */
export function AccountLink() {
  return (
    <Suspense fallback={<SignInLink />}>
      <AccountLinkForVisitor />
    </Suspense>
  );
}

async function AccountLinkForVisitor() {
  // Without Shopify login set up (e.g. on localhost), My Account shows the demo account.
  if (!customerAccountsEnabled || (await isLoggedIn())) {
    return (
      <Link href="/account" aria-label="My Account" title="My Account" className={iconLink}>
        <User className="size-5 stroke-[1.5]" />
        {customerAccountsEnabled && (
          <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-success ring-2 ring-background" />
        )}
      </Link>
    );
  }
  return <SignInLink />;
}

function SignInLink({ className }: { className?: string }) {
  // A plain <a>, not <Link>: the login route redirects to Shopify and must never be prefetched.
  return (
    <a href="/account/login?next=/account" aria-label="Sign in" title="Sign in" className={cn(iconLink, className)}>
      <User className="size-5 stroke-[1.5]" />
    </a>
  );
}
