"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { type ReactNode, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import CustomSearchInput from "~/CustomSearchInput";

const subscribeToScroll = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};

/**
 * Sticky header. Transparent at the top of the page (it sits on the hero in the design),
 * solid with a blur once the page is scrolled.
 */
export function HeaderShell({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 8,
    () => false,
  );

  return (
    <header
      data-scrolled={scrolled || undefined}
      className={cn(
        "sticky top-0 z-50 flex h-[69px] items-center gap-3 border-b border-transparent px-4 transition-[background-color,border-color,box-shadow] duration-300 sm:px-6 lg:pr-[55px] lg:pl-[78px]",
        scrolled && "border-border bg-background/90 shadow-sm backdrop-blur-md",
      )}
    >
      {children}
    </header>
  );
}

type HeaderSearchProps = { className?: string; inputClassName?: string; defaultValue?: string; onSearch?: () => void };

export function HeaderSearch({ className, inputClassName, defaultValue, onSearch }: HeaderSearchProps) {
  const router = useRouter();

  return (
    <form
      role="search"
      className={cn("w-[277px]", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
        if (!q) return;
        router.push(`/search?q=${encodeURIComponent(q)}`);
        onSearch?.();
      }}
    >
      <CustomSearchInput
        name="q"
        aria-label="Search products"
        placeholder="Search products..."
        value={defaultValue} // seeds the box; the input keeps its own state while typing
        className={cn(
          "h-9 rounded-md border-border bg-field font-heading text-sm tracking-[-0.15px] placeholder:text-placeholder",
          inputClassName,
        )}
      />
    </form>
  );
}

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="grid size-9 place-items-center rounded-full border bg-elevated transition-colors hover:bg-accent dark:bg-white dark:text-[#09090b]"
    >
      <Sun className="size-5 stroke-[1.5] dark:hidden" />
      <Moon className="hidden size-5 stroke-[1.5] dark:block" />
    </button>
  );
}
