import { Heart, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { NAV_LINKS } from "./data";
import { HeaderSearch, HeaderShell, ThemeToggle } from "./header-actions";

const ICON_LINKS = [
  { label: "Account", href: "/account", icon: User },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
];

export function Header() {
  return (
    <HeaderShell>
      <Logo data-on-hero className="w-[100px] shrink-0 text-foreground" />

      <nav data-on-hero aria-label="Main" className="hidden items-center gap-1 pl-4 lg:flex">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
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

      <div className="ml-auto flex items-center gap-1 md:ml-2">
        <ThemeToggle />
        {ICON_LINKS.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-label={label}
            className="grid size-9 place-items-center rounded-full border transition-colors hover:bg-accent"
          >
            <Icon className="size-5 stroke-[1.5]" />
          </Link>
        ))}
      </div>
    </HeaderShell>
  );
}
