"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { type ReactNode, useCallback, useId, useRef, useState, useSyncExternalStore } from "react";
import { suggest } from "@/components/search/actions";
import { SearchSuggestions } from "@/components/search/search-suggestions";
import type { Suggestions } from "@/lib/shopify/search";
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

/** Search box with Shopify suggestions while typing. Enter opens the full results page. */
export function HeaderSearch({ className, inputClassName, defaultValue, onSearch }: HeaderSearchProps) {
  const router = useRouter();
  const listId = useId();
  const [term, setTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [open, setOpen] = useState(false);
  const latest = useRef("");

  const close = () => setOpen(false);
  const picked = () => {
    close();
    onSearch?.();
  };

  // Runs 300ms after typing stops. Ignores answers for anything but the latest text. Must keep the same
  // identity between renders: the search input re-runs its effect whenever onSearch changes.
  const lookUp = useCallback(async (value: string) => {
    const q = value.trim();
    latest.current = q;
    if (q.length < 2) {
      setSuggestions(null);
      return;
    }
    const result = await suggest(q);
    if (latest.current !== q) return;
    setTerm(q);
    setSuggestions(result);
    setOpen(true);
  }, []);

  return (
    <form
      role="search"
      className={cn("relative w-[277px]", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
        if (!q) return;
        close();
        router.push(`/search?q=${encodeURIComponent(q)}`);
        onSearch?.();
      }}
      // Close when focus leaves the box and its suggestions (e.g. tabbing away or clicking elsewhere).
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) close();
      }}
      onFocus={() => suggestions && setOpen(true)}
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <CustomSearchInput
        name="q"
        aria-label="Search products"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        autoComplete="off"
        placeholder="Search products..."
        value={defaultValue} // seeds the box; the input keeps its own state while typing
        onSearch={lookUp}
        onClear={() => lookUp("")}
        className={cn(
          "h-9 rounded-md border-border bg-field font-heading text-sm tracking-[-0.15px] placeholder:text-placeholder",
          inputClassName,
        )}
      />
      {open && suggestions && (
        <SearchSuggestions id={listId} query={term} suggestions={suggestions} onPick={picked} />
      )}
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
