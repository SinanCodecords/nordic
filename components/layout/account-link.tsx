import { User } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { customerAccountsEnabled, getSignedInShopper } from "@/lib/shopify/customer";
import { cn } from "@/lib/utils";
import { AccountMenu } from "./account-menu";

const iconLink = "relative grid size-9 place-items-center rounded-full border transition-colors hover:bg-accent";

/**
 * The person icon in the header. Signed out, it starts Shopify login; signed in, it shows a green dot and opens
 * a menu (My Account, Orders, Wishlist, Profile, Sign Out). It reads the login cookie, so it streams in after
 * the (prerendered) header.
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
  if (!customerAccountsEnabled) {
    return (
      <Link href="/account" aria-label="My Account" title="My Account" className={iconLink}>
        <User className="size-5 stroke-[1.5]" />
      </Link>
    );
  }
  const shopper = await getSignedInShopper();
  return shopper ? <AccountMenu email={shopper.email} className={iconLink} /> : <SignInLink />;
}

function SignInLink({ className }: { className?: string }) {
  // A plain <a>, not <Link>: the login route redirects to Shopify and must never be prefetched.
  return (
    <a href="/account/login?next=/account" aria-label="Sign in" title="Sign in" className={cn(iconLink, className)}>
      <User className="size-5 stroke-[1.5]" />
    </a>
  );
}
