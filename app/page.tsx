import { Categories, getHomeSection, Hero, ProductSection, PromoBanner } from "@/components/home";

// Each section shows a Shopify collection. Until "best-sellers" or "new-arrivals" has products, Shopify's
// own best sellers / newest products fill in.
const HomePage = async () => {
  const [trending, bestSellers, newArrivals] = await Promise.all([
    getHomeSection("trending", { sortKey: "BEST_SELLING", viewAllHref: "/collections/all" }),
    getHomeSection("best-sellers", { sortKey: "BEST_SELLING", viewAllHref: "/collections/all" }),
    getHomeSection("new-arrivals", { sortKey: "CREATED_AT", viewAllHref: "/collections/all?sort=newest" }),
  ]);

  return (
    <>
      <Hero />
      <PromoBanner />
      <Categories />
      <ProductSection
        title="Trending Now"
        subtitle="What everyone is wearing this season."
        className="bg-elevated"
        {...trending}
      />
      <ProductSection title="Best Sellers" subtitle="Our most popular pieces, proven over time." {...bestSellers} />
      <ProductSection title="New Arrivals" subtitle="Fresh additions to our permanent collection." {...newArrivals} />
    </>
  );
};

export default HomePage;
