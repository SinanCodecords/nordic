import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

/** Five rating stars, filled up to the rounded value. */
export function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`Rated ${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "size-3 stroke-2",
            i <= Math.round(value) ? "fill-star text-star" : "text-[#e4e4e7] dark:text-border",
            className,
          )}
        />
      ))}
    </span>
  );
}
