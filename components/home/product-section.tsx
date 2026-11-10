import { ProductCard, type ProductCardData } from "@/components/shared/product-card";
import { SectionHeader } from "@/components/shared/section-header";

type ProductSectionProps = {
  title: string;
  subtitle: string;
  viewAllHref: string;
  products: ProductCardData[];
  className?: string;
};

export function ProductSection({ title, subtitle, viewAllHref, products, className }: ProductSectionProps) {
  return (
    <section className={className}>
      <div className="content-width py-14">
        <SectionHeader title={title} subtitle={subtitle} viewAllHref={viewAllHref} />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={`${product.handle}-${i}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
