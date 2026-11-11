import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { COLLECTIONS, CollectionResults, CollectionResultsSkeleton } from "@/components/collection";
import type { CollectionData } from "@/components/collection/data";
import { toProductCard } from "@/components/shared/from-shopify";
import { Skeleton } from "@/components/ui/skeleton";
import { getCollection, getCollections } from "@/lib/shopify";
import CustomBreadcrumb from "~/CustomBreadcrumb";

type Props = PageProps<"/collections/[handle]">;

async function loadCollection(params: Props["params"]): Promise<CollectionData & { seoTitle?: string }> {
  const { handle } = await params;
  const collection = await getCollection(handle);
  if (!collection) notFound();
  return {
    title: collection.title,
    // Our own wording is the fallback while the collection's description is empty in Shopify.
    description: collection.description || COLLECTIONS[handle]?.description || "",
    seoTitle: collection.seo.title ?? undefined,
    products: collection.products.map(toProductCard),
  };
}

export async function generateStaticParams() {
  return (await getCollections()).map(({ handle }) => ({ handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title, seoTitle, description } = await loadCollection(params);
  return { title: seoTitle ?? title, description };
}

// The title is prerendered per collection; the filtered products stream in because they read the URL.
export default function CollectionPage({ params, searchParams }: Props) {
  return (
    <div className="content-width pt-9 pb-24">
      <Suspense fallback={<HeadingSkeleton />}>
        <CollectionHeading params={params} />
      </Suspense>
      <Suspense fallback={<CollectionResultsSkeleton />}>
        <Results params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CollectionHeading({ params }: Pick<Props, "params">) {
  const { title, description } = await loadCollection(params);
  return (
    <>
      <CustomBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: title, isCurrentPage: true }]}
        currentClassName="font-medium"
      />
      <h1 className="pt-4 type-page-title">{title}</h1>
      {description && <p className="pt-2 type-body text-muted-foreground">{description}</p>}
    </>
  );
}

async function Results({ params, searchParams }: Props) {
  return <CollectionResults collection={await loadCollection(params)} searchParams={searchParams} />;
}

function HeadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-5 w-72" />
    </div>
  );
}
