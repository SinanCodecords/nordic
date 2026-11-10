"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { updateQuantity } from "./actions";

/** Quantity and remove for one cart line. The page re-renders with Shopify's totals after each change. */
export function LineControls({ lineId, quantity }: { lineId: string; quantity: number }) {
  const [pending, startTransition] = useTransition();

  const set = (next: number) =>
    startTransition(async () => {
      const { error } = await updateQuantity(lineId, next);
      if (error) toast.error(error);
    });

  return (
    <div className="flex items-center gap-2" aria-busy={pending}>
      <QuantitySelector value={quantity} onChange={set} disabled={pending} className={pending ? "opacity-60" : ""} />
      <button
        type="button"
        aria-label="Remove item"
        disabled={pending}
        onClick={() => set(0)}
        className="grid size-10 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-destructive disabled:opacity-40"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  );
}
