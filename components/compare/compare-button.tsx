"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MAX_COMPARE } from "./shared";
import { toggleCompare, useCompareList } from "./store";

/** The small "Compare" link on product cards. */
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
        "relative z-10 flex items-center gap-1 transition-colors hover:text-foreground",
        added && "text-foreground",
      )}
    >
      {added && <Check className="size-3" />}
      Compare
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
