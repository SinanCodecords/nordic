"use client";

import { LayoutGrid, List } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCollectionParams } from "./collection-state";
import { SORT_OPTIONS } from "./params";

const VIEWS = [
  { value: "grid", label: "Grid view", icon: LayoutGrid },
  { value: "list", label: "List view", icon: List },
] as const;

export function CollectionToolbar({ count }: { count: number }) {
  const [{ sort, view }, setParams] = useCollectionParams();

  return (
    <div className="flex items-center justify-between gap-3 border-y py-3">
      <p className="type-body text-muted-foreground" aria-live="polite">
        {count} {count === 1 ? "product" : "products"}
      </p>

      <div className="flex items-center gap-2">
        <Select
          value={sort}
          onValueChange={(value: typeof sort) => setParams({ sort: value === "featured" ? null : value })}
        >
          <SelectTrigger aria-label="Sort products" className="w-[176px] bg-transparent type-body">
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {SORT_OPTIONS.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div role="group" aria-label="Layout" className="flex gap-1 rounded-md border p-0.5">
          {VIEWS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-label={label}
              aria-pressed={view === value}
              onClick={() => setParams({ view: value === "grid" ? null : value })}
              className={cn(
                "grid size-8 place-items-center rounded-sm text-muted-foreground transition-colors hover:text-foreground",
                view === value && "bg-primary text-primary-foreground shadow-sm hover:text-primary-foreground",
              )}
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
