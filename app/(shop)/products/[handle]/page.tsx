import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProductDetail, ProductGallery, ProductInfo, ProductTabs } from "@/components/product";
import { getProductReviews, reviewsEnabled } from "@/lib/reviews/judgeme";
import { ProductCard } from "@/components/shared/product-card";
import { DEMO_PRODUCT_HANDLES } from "@/components/shared/demo-products";
import { Skeleton } from "@/components/ui/skeleton";
import CustomBreadcrumb from "~/CustomBreadcrumb";

type Props = PageProps<"/products/[handle]">;

async function getProduct(params: Props["params"]) {
  const product = getProductDetail((await params).handle);
  if (!product) notFound();
  return product;
}

export function generateStaticParams() {
  return DEMO_PRODUCT_HANDLES.map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title, description, image } = await getProduct(params);
  return { title, description, openGraph: { images: [image] } };
}

export default function ProductPage({ params }: Props) {
  return (
    <div className="content-width pt-9 pb-24">
      <Suspense fallback={<ProductSkeleton />}>
        <Product params={params} />
      </Suspense>
    </div>
  );
}

async function Product({ params }: Pick<Props, "params">) {
  const product = await getProduct(params);
  const reviews = await getProductReviews(product.id);

  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: product.category.label, href: product.category.href },
          { label: product.title, isCurrentPage: true },
        ]}
        currentClassName="font-medium"
      />

      <div className="grid gap-6 pt-6 lg:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />
        <ProductInfo product={product} />
      </div>

      <ProductTabs product={product} reviews={reviews} canReview={reviewsEnabled && !!product.id} />

      {product.related.length > 0 && (
        <section className="pt-14">
          <h2 className="type-section-heading">You might also like</h2>
          <div className="grid gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-4">
            {product.related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-5 w-56" />
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="aspect-[628/584] rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-72" />
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    </div>
  );
}
