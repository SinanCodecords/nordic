"use client";

import { Heart, LayoutDashboard, LogOut, Package, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LINKS = [
  { label: "My Account", href: "/account", icon: LayoutDashboard },
  { label: "Orders", href: "/account/orders", icon: Package },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Profile", href: "/account/profile", icon: User },
];

/** The person icon for a signed-in shopper: opens a menu with account shortcuts and Sign Out. */
export function AccountMenu({ email, className }: { email: string | null; className: string }) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger aria-label="Account menu" className={className}>
        <User className="size-5 stroke-[1.5]" />
        <span className="absolute top-0.5 right-0.5 size-2 rounded-full bg-success ring-2 ring-background" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-60">
        <DropdownMenuLabel className="font-normal">
          <span className="block text-xs text-muted-foreground">Signed in as</span>
          <span className="block truncate text-sm font-medium">{email ?? "your Shopify account"}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LINKS.map(({ label, href, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href}>
              <Icon /> {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {/* POST (not a link) so another site can't sign the shopper out. The form sits outside the menu. */}
        <DropdownMenuItem asChild variant="destructive">
          <button type="submit" form="sign-out-form" className="w-full">
            <LogOut /> Sign Out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
      <form id="sign-out-form" action="/account/logout" method="post" hidden />
    </DropdownMenu>
  );
}
