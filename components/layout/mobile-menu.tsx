"use client";

import { GitCompareArrows, Heart, Menu, Package, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { CompareCount } from "@/components/compare/compare-button";
import { Logo } from "@/components/shared/logo";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { HeaderSearch, ThemeToggle } from "./header-actions";

const MORE_LINKS = [
  { label: "My Account", href: "/account", icon: User },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
  { label: "Compare", href: "/compare", icon: GitCompareArrows },
  { label: "Track Order", href: "/track-order", icon: Package },
];

/** Menu button and slide-out panel for screens below 1024px, where the header links are hidden. */
export function MobileMenu({ links }: { links: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        data-on-hero
        aria-label="Open menu"
        className="-ml-2 grid size-9 shrink-0 place-items-center rounded-md text-foreground transition-colors hover:bg-accent lg:hidden"
      >
        <Menu className="size-5 stroke-[1.5]" />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[min(320px,85vw)] gap-0 overflow-y-auto p-0"
        // Focus the panel, not the search box: on phones that would pop up the keyboard straight away.
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          (e.currentTarget as HTMLElement | null)?.focus();
        }}
      >
        <div className="flex h-[69px] shrink-0 items-center border-b px-4">
          <SheetClose asChild>
            <Logo className="w-[90px] text-foreground" />
          </SheetClose>
        </div>
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Shop categories, account and settings</SheetDescription>

        <div className="space-y-6 p-4">
          <HeaderSearch className="w-full" onSearch={() => setOpen(false)} />

          <nav aria-label="Shop">
            <p className="px-3 pb-1 type-eyebrow text-muted-foreground">Shop</p>
            <ul>
              {links.map((link) => (
                <li key={`${link.label}-${link.href}`}>
                  <SheetClose asChild>
                    <Link
                      href={link.href}
                      aria-current={pathname === link.href ? "page" : undefined}
                      className={cn(
                        "flex h-11 items-center rounded-md px-3 font-heading text-base tracking-[-0.15px] transition-colors hover:bg-accent",
                        pathname === link.href && "bg-elevated font-medium",
                      )}
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account and orders" className="border-t pt-4">
            <ul>
              {MORE_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={href}>
                  <SheetClose asChild>
                    <Link
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                      className={cn(
                        "flex h-10 items-center gap-3 rounded-md px-3 type-label text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
                        pathname === href && "bg-elevated text-foreground",
                      )}
                    >
                      <Icon className="size-4" />
                      {label}
                      {href === "/compare" && <CompareCount />}
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-between border-t px-3 pt-4">
            <span className="type-label">Dark mode</span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
