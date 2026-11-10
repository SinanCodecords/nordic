"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import CustomSearchInput from "~/CustomSearchInput";

export function HeaderSearch() {
  const router = useRouter();

  return (
    <form
      role="search"
      className="w-[277px]"
      onSubmit={(e) => {
        e.preventDefault();
        const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
        if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
    >
      <CustomSearchInput
        name="q"
        aria-label="Search products"
        placeholder="Search products..."
        className="h-9 rounded-md border-border bg-field font-heading text-sm tracking-[-0.15px] placeholder:text-placeholder"
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
