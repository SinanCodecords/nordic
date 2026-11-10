"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { readCompare, writeCompare } from "./store";

// The table is rendered on the server from the cookie, so after a change we refresh the page.
function useUpdate() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const update = (handles: string[]) => {
    writeCompare(handles);
    startTransition(() => router.refresh());
  };
  return { pending, update };
}

export function RemoveFromCompare({ handle, title }: { handle: string; title: string }) {
  const { pending, update } = useUpdate();
  return (
    <button
      type="button"
      aria-label={`Remove ${title} from compare`}
      disabled={pending}
      onClick={() => update(readCompare().filter((h) => h !== handle))}
      className="absolute top-2 right-2 z-10 grid size-8 place-items-center rounded-full border bg-overlay text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground disabled:opacity-50"
    >
      <X className="size-4" />
    </button>
  );
}

export function ClearCompare() {
  const { pending, update } = useUpdate();
  return (
    <Button variant="outline" size="sm" disabled={pending} onClick={() => update([])}>
      Clear all
    </Button>
  );
}
