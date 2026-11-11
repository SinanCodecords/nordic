"use client";

import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { NoImage } from "@/components/shared/product-card";
import { cn } from "@/lib/utils";

/** Main photo that zooms toward the cursor on hover, with thumbnails when there's more than one photo. */
export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [origin, setOrigin] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div
        className="group relative aspect-[628/584] overflow-hidden rounded-lg border bg-elevated"
        onMouseMove={(e) => {
          const box = e.currentTarget.getBoundingClientRect();
          setOrigin(`${((e.clientX - box.left) / box.width) * 100}% ${((e.clientY - box.top) / box.height) * 100}%`);
        }}
        onMouseLeave={() => setOrigin(null)}
      >
        {images.length === 0 && <NoImage />}
        {images.length > 0 && (
          <Image
            src={images[active]}
            alt={title}
            fill
            preload
            sizes="(min-width: 1280px) 628px, (min-width: 1024px) 50vw, 100vw"
            style={origin ? { transformOrigin: origin } : undefined}
            className={cn("object-cover transition-transform duration-200", origin && "scale-200")}
          />
        )}
        <span
          className={cn(
            "pointer-events-none absolute right-3 bottom-3 hidden items-center gap-1.5 rounded-full bg-overlay px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm transition-opacity md:flex",
            (origin || images.length === 0) && "opacity-0",
          )}
        >
          <ZoomIn className="size-3.5" /> Hover to zoom
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`View image ${i + 1}`}
              aria-current={i === active || undefined}
              onClick={() => setActive(i)}
              className={cn(
                "relative size-20 overflow-hidden rounded-md border bg-elevated transition-[box-shadow]",
                i === active && "ring-2 ring-selected ring-offset-2 ring-offset-background",
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
