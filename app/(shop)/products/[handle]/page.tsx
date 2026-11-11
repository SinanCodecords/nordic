import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductGallery, ProductInfo, ProductTabs } from "@/components/product";
import { toProductDetail } from "@/components/product/from-shopify";
import { ProductCard } from "@/components/shared/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProductReviews, reviewsEnabled } from "@/lib/reviews/judgeme";
import {
  getCollectionProducts,
  getProduct,
  getProductHandles,
  getProductRecommendations,
  getProductStock,
  type Product as ShopifyProduct,
} from "@/lib/shopify";
import CustomBreadcrumb from "~/CustomBreadcrumb";

type Props = PageProps<"/products/[handle]">;

async function loadProduct(params: Props["params"]) {
  const product = await getProduct((await params).handle);
  if (!product) notFound();
  return product;
}

/** Others from the same collection first (like the design), then Shopify's own picks. */
async function getRelated(product: ShopifyProduct) {
  const collection = product.productType.toLowerCase().replace(/\s+/g, "-");
  const [sameType, picks] = await Promise.all([
    collection ? getCollectionProducts(collection, 8).catch(() => []) : [],
    getProductRecommendations(product.id).catch(() => []),
  ]);
  const seen = new Set([product.handle]);
  return [...sameType, ...picks].filter((p) => !seen.has(p.handle) && seen.add(p.handle));
}

export async function generateStaticParams() {
  return (await getProductHandles()).map((handle) => ({ handle }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title, description, featuredImage } = await loadProduct(params);
  return {
    title,
    description: description.slice(0, 160),
    openGraph: { images: featuredImage ? [featuredImage.url] : [] },
  };
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
  const shopifyProduct = await loadProduct(params);
  const [reviews, stock, related] = await Promise.all([
    getProductReviews(shopifyProduct.id),
    getProductStock(shopifyProduct.handle),
    getRelated(shopifyProduct),
  ]);
  const product = toProductDetail(shopifyProduct, { related, stock });
  // Judge.me's reviews give the live average; the rating saved on the product can lag behind.
  if (reviews.length) {
    product.reviewCount = reviews.length;
    product.rating = Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10;
  }

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
