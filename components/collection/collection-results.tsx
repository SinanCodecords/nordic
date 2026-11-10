import { ProductCard } from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { CollectionFilters } from "./collection-filters";
import { CollectionStateProvider, PendingArea } from "./collection-state";
import { CollectionToolbar } from "./collection-toolbar";
import { BRANDS, type CollectionData } from "./data";
import { filterProducts, loadCollectionParams } from "./params";

type Props = {
  collection: CollectionData;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/** Toolbar, filter sidebar and product grid. They read the URL, so they stream in after the page title. */
export async function CollectionResults({ collection, searchParams }: Props) {
  const params = await loadCollectionParams(searchParams);
  const products = filterProducts(collection.products, params);
  const list = params.view === "list";

  return (
    <CollectionStateProvider>
      <div className="mt-6">
        <CollectionToolbar count={products.length} />
      </div>

      <div className="grid gap-6 pt-6 lg:grid-cols-[238px_1fr]">
        <CollectionFilters brands={BRANDS} />

        <PendingArea className="min-w-0 transition-opacity data-pending:opacity-60">
          {products.length ? (
            <ul className={cn("grid gap-5", list ? "grid-cols-1" : "sm:grid-cols-2 xl:grid-cols-4")}>
              {products.map((product, i) => (
                <li key={product.handle}>
                  <ProductCard product={product} layout={params.view} imageClassName="h-[215px]" preload={i < 4} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed py-16 text-center type-body text-muted-foreground">
              No products match these filters. Try another brand, price or rating.
            </p>
          )}
        </PendingArea>
      </div>
    </CollectionStateProvider>
  );
}

export function CollectionResultsSkeleton() {
  return (
    <>
      <Skeleton className="mt-6 h-16 rounded-none" />
      <div className="grid gap-6 pt-6 lg:grid-cols-[238px_1fr]">
        <Skeleton className="h-11 lg:h-[640px]" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <Skeleton key={i} className="h-[352px]" />
          ))}
        </div>
      </div>
    </>
  );
}
