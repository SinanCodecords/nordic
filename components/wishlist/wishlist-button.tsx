"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { recentlyViewed, wishlist } from "./store";

type Props = { handle: string; title: string; className?: string; iconClassName?: string };

/** The heart on product cards and the product page. */
export function WishlistButton({ handle, title, className, iconClassName }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const saved = wishlist.useList().includes(handle);

  const onClick = () => {
    const result = wishlist.toggle(handle);
    if (result === "added") {
      toast(`${title} saved to your wishlist`, {
        action: { label: "View", onClick: () => router.push("/account/wishlist") },
      });
    } else if (result === "removed" && pathname === "/account/wishlist") {
      router.refresh(); // the wishlist page lists products on the server
    } else if (result === "full") {
      toast.error("Your wishlist is full. Remove something first.");
    }
  };

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${title} from wishlist` : `Add ${title} to wishlist`}
      onClick={onClick}
      className={cn(
        "grid place-items-center rounded-full border bg-overlay text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground",
        saved && "text-destructive hover:text-destructive",
        className,
      )}
    >
      <Heart className={cn("size-4", saved && "fill-current", iconClassName)} />
    </button>
  );
}

/** Notes a product page visit for "Recently Viewed" on the account overview. Renders nothing. */
export function TrackRecentlyViewed({ handle }: { handle: string }) {
  useEffect(() => {
    recentlyViewed.write([handle, ...recentlyViewed.read().filter((h) => h !== handle)]);
  }, [handle]);
  return null;
}

/** Number of saved items, for the heart in the header. */
export function WishlistCount() {
  const count = wishlist.useList().length;
  if (!count) return null;
  return (
    <span className="absolute -top-1 -right-1 grid size-4 place-items-center rounded-full bg-primary text-[10px] leading-none font-semibold text-primary-foreground">
      {count}
    </span>
  );
}
