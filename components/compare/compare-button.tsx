"use client";

import { ArrowLeftRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MAX_COMPARE } from "./shared";
import { toggleCompare, useCompareList } from "./store";

/** The "Compare" pill on product cards. Filled once the product is in the compare list. */
export function CompareButton({ handle, title }: { handle: string; title: string }) {
  const router = useRouter();
  const added = useCompareList().includes(handle);

  const onClick = () => {
    const result = toggleCompare(handle);
    if (result === "full") {
      toast.error(`You can compare up to ${MAX_COMPARE} products.`, {
        action: { label: "View", onClick: () => router.push("/compare") },
      });
    } else if (result === "added") {
      toast(`${title} added to compare`, {
        action: { label: "View", onClick: () => router.push("/compare") },
      });
    }
  };

  return (
    <button
      type="button"
      aria-pressed={added}
      aria-label={added ? `Remove ${title} from compare` : `Add ${title} to compare`}
      onClick={onClick}
      className={cn(
        "relative z-10 -my-1 inline-flex h-6 items-center gap-1 rounded-full border px-2.5 text-[11px] font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        added && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
      )}
    >
      {added ? <Check className="size-3" /> : <ArrowLeftRight className="size-3" />}
      {added ? "Comparing" : "Compare"}
    </button>
  );
}

/** Number of products in the compare list, for the "Compare" link in the category bar. */
export function CompareCount() {
  const count = useCompareList().length;
  if (!count) return null;
  return (
    <span className="ml-1 inline-grid size-[18px] place-items-center rounded-full bg-primary font-sans text-[11px] leading-none font-semibold text-primary-foreground">
      {count}
    </span>
  );
}
