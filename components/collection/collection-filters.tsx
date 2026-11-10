"use client";

import { Check, SlidersHorizontal } from "lucide-react";
import { type ReactNode, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useCollectionParams } from "./collection-state";
import { hasActiveFilters, PRICE_CEILING, RATING_OPTIONS } from "./params";

/** Phones and tablets: filters fold away behind a button. Desktop: always-visible sidebar. */
export function CollectionFilters({ brands }: { brands: string[] }) {
  return (
    <>
      <details className="group rounded-lg border lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-center gap-2 py-2.5 type-label [&::-webkit-details-marker]:hidden">
          <SlidersHorizontal className="size-4" />
          <span className="group-open:hidden">Show filters</span>
          <span className="hidden group-open:inline">Hide filters</span>
        </summary>
        <div className="border-t p-4">
          <FiltersPanel brands={brands} />
        </div>
      </details>
      <aside aria-label="Filters" className="hidden lg:block">
        <FiltersPanel brands={brands} />
      </aside>
    </>
  );
}

function FiltersPanel({ brands }: { brands: string[] }) {
  const [params, setParams] = useCollectionParams();
  const { brand, min, max, rating } = params;

  const toggleBrand = (name: string, checked: boolean) =>
    setParams({ brand: checked ? [...brand, name] : brand.filter((b) => b !== name) });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="type-label font-semibold">Filters</h2>
        {hasActiveFilters(params) && (
          <button
            type="button"
            onClick={() => setParams({ brand: null, min: null, max: null, rating: null })}
            className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterGroup title="Brand" className="pt-4">
        <ul className="space-y-2 pt-3">
          {brands.map((name) => (
            <li key={name}>
              <label className="flex cursor-pointer items-center gap-2 type-body">
                <Checkbox
                  checked={brand.includes(name)}
                  onCheckedChange={(checked) => toggleBrand(name, checked === true)}
                />
                {name}
              </label>
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Price Range" divided>
        <PriceSlider key={`${min}-${max}`} min={min} max={max} onCommit={([lo, hi]) => setParams({ min: lo || null, max: hi >= PRICE_CEILING ? null : hi })} />
      </FilterGroup>

      <FilterGroup title="Minimum Rating" divided>
        <ul className="space-y-2 pt-3">
          {RATING_OPTIONS.map((value) => {
            const active = rating === value;
            return (
              <li key={value}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => setParams({ rating: value || null })}
                  className={cn(
                    "flex h-[38px] w-full items-center gap-2 rounded-md border px-3 text-left type-body transition-colors hover:bg-accent",
                    active && "bg-elevated dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90",
                  )}
                >
                  {active && <Check className="size-3.5" />}
                  {value ? `${value}+ stars` : "All ratings"}
                </button>
              </li>
            );
          })}
        </ul>
      </FilterGroup>
    </div>
  );
}

/** Moves freely while dragging; the URL only changes when the thumb is let go. */
function PriceSlider({ min, max, onCommit }: { min: number; max: number; onCommit: (range: number[]) => void }) {
  const [range, setRange] = useState([min, max]);
  const [lo, hi] = range;

  return (
    <>
      <Slider
        value={range}
        min={0}
        max={PRICE_CEILING}
        step={10}
        minStepsBetweenThumbs={1}
        onValueChange={setRange}
        onValueCommit={onCommit}
        aria-label="Price range"
        className="mt-5"
      />
      <p className="flex justify-between pt-3 type-body text-muted-foreground">
        <span>${lo}</span>
        <span>{hi >= PRICE_CEILING ? `$${PRICE_CEILING}+` : `$${hi}`}</span>
      </p>
    </>
  );
}

function FilterGroup({
  title,
  divided,
  className,
  children,
}: {
  title: string;
  divided?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section aria-label={title} className={cn(divided && "mt-6 border-t pt-6", className)}>
      <h3 className="type-label font-semibold">{title}</h3>
      {children}
    </section>
  );
}
