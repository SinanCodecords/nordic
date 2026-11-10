import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { COMPARE_COOKIE, CompareTable, EmptyCompare, parseCompare } from "@/components/compare";
import { getProductDetail, type ProductDetail } from "@/components/product";
import { Skeleton } from "@/components/ui/skeleton";
import CustomBreadcrumb from "~/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Compare Products",
  robots: { index: false },
};

export default function ComparePage() {
  return (
    <div className="content-width pt-9 pb-24">
      <CustomBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Compare", isCurrentPage: true }]}
        currentClassName="font-medium"
      />
      <Suspense fallback={<Skeleton className="mt-6 h-[480px] w-full" />}>
        <CompareContents />
      </Suspense>
    </div>
  );
}

// Reads the compare cookie, so it streams in after the breadcrumb.
async function CompareContents() {
  const handles = parseCompare((await cookies()).get(COMPARE_COOKIE)?.value);
  const products = handles.map(getProductDetail).filter((p): p is ProductDetail => !!p);
  if (!products.length) return <EmptyCompare />;
  return <CompareTable products={products} />;
}
