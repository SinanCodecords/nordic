import { BEST_SELLERS, Categories, Hero, NEW_ARRIVALS, ProductSection, PromoBanner, TRENDING } from "@/components/home";

const HomePage = () => {
  return (
    <>
      <Hero />
      <PromoBanner />
      <Categories />
      <ProductSection
        title="Trending Now"
        subtitle="What everyone is wearing this season."
        viewAllHref="/collections/trending"
        products={TRENDING}
        className="bg-elevated"
      />
      <ProductSection
        title="Best Sellers"
        subtitle="Our most popular pieces, proven over time."
        viewAllHref="/collections/best-sellers"
        products={BEST_SELLERS}
      />
      <ProductSection
        title="New Arrivals"
        subtitle="Fresh additions to our permanent collection."
        viewAllHref="/collections/new-arrivals"
        products={NEW_ARRIVALS}
      />
    </>
  );
};

export default HomePage;
