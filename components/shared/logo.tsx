import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Logo({ className, ...props }: Omit<ComponentProps<typeof Link>, "href">) {
  return (
    <Link
      href="/"
      aria-label="Nordic home"
      className={cn(
        "font-heading text-lg leading-7 font-bold tracking-[-0.89px] uppercase",
        className,
      )}
      {...props}
    >
      Nordic<span className="ml-2 font-sans font-light">.</span>
    </Link>
  );
}
