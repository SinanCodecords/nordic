import { Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { WishlistCount } from "@/components/wishlist/wishlist-button";
import { getMenu } from "@/lib/shopify/menu";
import { NAV_LINKS } from "./data";
import { HeaderSearch, HeaderShell, ThemeToggle } from "./header-actions";
import { MobileMenu } from "./mobile-menu";

const ICON_LINKS = [
  { label: "Account", href: "/account", icon: User },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
];

/** The links come from the "main-menu" menu in Shopify admin (Content → Menus). */
export async function Header() {
  const links = await getMenu("main-menu", NAV_LINKS);

  return (
    <HeaderShell>
      <MobileMenu links={links} />
      <Logo data-on-hero className="w-[100px] shrink-0 text-foreground" />

      {/* min-w-0 + scroll: a long Shopify menu scrolls inside the bar instead of widening the page. */}
      <nav
        data-on-hero
        aria-label="Main"
        className="hidden min-w-0 items-center gap-1 overflow-x-auto pl-4 [scrollbar-width:none] lg:flex"
      >
        {links.map((link) => (
          <Link
            key={`${link.label}-${link.href}`}
            href={link.href}
            className="rounded-md px-3 py-2 type-nav text-foreground-secondary transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="ml-auto hidden md:block">
        <HeaderSearch />
      </div>

      <div data-on-hero-mobile className="ml-auto flex items-center gap-1 text-foreground md:ml-2">
        <ThemeToggle />
        {ICON_LINKS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className="relative grid size-9 place-items-center rounded-full border transition-colors hover:bg-accent"
          >
            <Icon className="size-5 stroke-[1.5]" />
            {label === "Wishlist" && <WishlistCount />}
          </Link>
        ))}
      </div>
    </HeaderShell>
  );
}
