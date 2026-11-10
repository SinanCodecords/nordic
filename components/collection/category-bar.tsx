import Link from "next/link";
import { CompareCount } from "@/components/compare/compare-button";
import { cn } from "@/lib/utils";
import { CATEGORY_LINKS } from "./data";

const link = "shrink-0 font-heading text-sm leading-5 tracking-[-0.15px] text-muted-foreground transition-colors hover:text-foreground";

/** The "All Categories" row under the header on shop pages. */
export function CategoryBar() {
  return (
    <div className="border-t">
      <nav
        aria-label="Categories"
        className="flex items-center gap-4 overflow-x-auto px-4 pt-[9px] pb-[7px] [scrollbar-width:none] sm:px-6 lg:pr-[55px] lg:pl-[78px]"
      >
        <span className="flex h-10 shrink-0 items-center font-heading text-sm leading-5 font-semibold tracking-[-0.15px]">
          All Categories:
        </span>
        {CATEGORY_LINKS.map(({ label, href }) => (
          <Link key={href} href={href} className={link}>
            {label}
          </Link>
        ))}
        <span aria-hidden className="ml-auto h-5 w-px shrink-0 bg-border" />
        <Link href="/compare" className={cn(link, "flex items-center")}>
          Compare
          <CompareCount />
        </Link>
        <Link href="/track-order" className={link}>
          Track Order
        </Link>
      </nav>
    </div>
  );
}
