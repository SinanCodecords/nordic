"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type QuantitySelectorProps = {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
};

/** The − 1 + box from the Figma "Quantity Selector" component. */
export function QuantitySelector({ value, onChange, min = 1, max, disabled, className }: QuantitySelectorProps) {
  const button =
    "grid size-10 place-items-center text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className={cn("inline-flex items-center rounded-md border", className)}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        className={button}
      >
        <Minus className="size-4" />
      </button>
      <span className="w-10 text-center type-label" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || (max !== undefined && value >= max)}
        onClick={() => onChange(value + 1)}
        className={button}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
