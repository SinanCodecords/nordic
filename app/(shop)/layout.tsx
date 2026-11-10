import { CategoryBar } from "@/components/collection";

// Shop pages (collections, later search and product pages) get the category row under the header.
export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <CategoryBar />
      {children}
    </>
  );
}
