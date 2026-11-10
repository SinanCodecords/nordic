import { SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CollectionResults, CollectionResultsSkeleton } from "@/components/collection";
import { CATEGORY_LINKS } from "@/components/collection/data";
import { HeaderSearch } from "@/components/layout/header-actions";
import { loadSearchParams, searchProducts } from "@/components/search/search";
import { pickProducts } from "@/components/shared/demo-products";
import { ProductCard } from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import CustomBreadcrumb from "~/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

type Props = PageProps<"/search">;

// Shown when there's nothing to search for or nothing matched. Swap for Shopify best sellers later.
const POPULAR = pickProducts(
  "silk-slip-dress",
  "stride-runner-sneakers",
  "automatic-wristwatch",
  "wireless-noise-cancel-headphones",
);

export default function SearchPage({ searchParams }: Props) {
  return (
    <div className="content-width pt-9 pb-24">
      <CustomBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Search", isCurrentPage: true }]}
        currentClassName="font-medium"
      />
      <Suspense fallback={<SearchSkeleton />}>
        <SearchContents searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

// Reads ?q= from the URL, so it streams in after the breadcrumb.
async function SearchContents({ searchParams }: Pick<Props, "searchParams">) {
  const { q } = await loadSearchParams(searchParams);
  const query = q.trim();
  const products = searchProducts(query);

  return (
    <>
      <h1 className="pt-4 type-page-title">{query ? <>Results for &ldquo;{query}&rdquo;</> : "Search"}</h1>
      {/* key: reset the box when the query in the URL changes */}
      <HeaderSearch key={query} defaultValue={query} className="w-full max-w-xl pt-4" inputClassName="h-11 text-base" />

      {products.length ? (
        <CollectionResults
          collection={{ title: query, description: "", products }}
          searchParams={searchParams}
        />
      ) : (
        <NoResults query={query} />
      )}
    </>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <>
      <div className="mt-8 flex flex-col items-center rounded-lg border px-6 py-14 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-elevated">
          <SearchX className="size-8 stroke-[1.5] text-muted-foreground" />
        </span>
        <h2 className="pt-4 text-lg leading-7 font-semibold tracking-[-0.44px]">
          {query ? "No products found" : "What are you looking for?"}
        </h2>
        <p className="max-w-96 pt-1.5 type-body text-muted-foreground">
          {query
            ? "Check the spelling or try a broader word, like a brand, colour or category."
            : "Search by product name, brand, colour or category."}
        </p>
        <ul className="flex flex-wrap justify-center gap-2 pt-6" aria-label="Browse categories">
          {CATEGORY_LINKS.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="block rounded-full border px-4 py-1.5 type-label transition-colors hover:bg-accent"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <section className="pt-12">
        <h2 className="type-section-heading">Popular Right Now</h2>
        <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}

function SearchSkeleton() {
  return (
    <div className="space-y-4 pt-4">
      <Skeleton className="h-9 w-72" />
      <Skeleton className="h-11 w-full max-w-xl" />
      <CollectionResultsSkeleton />
    </div>
  );
}
