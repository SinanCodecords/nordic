import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { COLLECTIONS, CollectionResults, CollectionResultsSkeleton } from "@/components/collection";
import { Skeleton } from "@/components/ui/skeleton";
import CustomBreadcrumb from "~/CustomBreadcrumb";

type Props = PageProps<"/collections/[handle]">;

async function getCollection(params: Props["params"]) {
  const collection = COLLECTIONS[(await params).handle];
  if (!collection) notFound();
  return collection;
}

export function generateStaticParams() {
  return Object.keys(COLLECTIONS).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title, description } = await getCollection(params);
  return { title, description };
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
  const { title, description } = await getCollection(params);
  return (
    <>
      <CustomBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: title, isCurrentPage: true }]}
        currentClassName="font-medium"
      />
      <h1 className="pt-4 type-page-title">{title}</h1>
      <p className="pt-2 type-body text-muted-foreground">{description}</p>
    </>
  );
}

async function Results({ params, searchParams }: Props) {
  return <CollectionResults collection={await getCollection(params)} searchParams={searchParams} />;
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
