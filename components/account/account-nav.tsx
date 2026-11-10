"use client";

import { Bell, CreditCard, Heart, LayoutDashboard, LogOut, MapPin, Package, Settings, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const ACCOUNT_LINKS = [
  { label: "Overview", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Addresses", href: "/account/addresses", icon: MapPin },
  { label: "Payment Methods", href: "/account/payment-methods", icon: CreditCard },
  { label: "Profile", href: "/account/profile", icon: User },
  { label: "Notifications", href: "/account/notifications", icon: Bell },
  { label: "Settings", href: "/account/settings", icon: Settings },
];

const item =
  "flex h-9 shrink-0 items-center gap-2.5 rounded-md px-3 type-label text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

/** Account sidebar. A scrolling row of tabs on small screens. */
export function AccountNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Account" className="lg:w-[237px] lg:shrink-0">
      <ul className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:mx-0 lg:flex-col lg:px-0">
        {ACCOUNT_LINKS.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(item, active && "bg-elevated text-foreground")}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            </li>
          );
        })}
        <li className="lg:mt-3 lg:border-t lg:pt-3">
          {/* POST so a link on another site can't sign the customer out. */}
          <form action="/account/logout" method="post">
            <button type="submit" className={cn(item, "w-full")}>
              <LogOut className="size-4" />
              Sign Out
            </button>
          </form>
        </li>
      </ul>
    </nav>
  );
}
