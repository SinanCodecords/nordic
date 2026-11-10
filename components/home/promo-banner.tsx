import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="relative z-30 border-y border-[#e4e4e7] bg-elevated shadow-[0_4px_34px_rgb(0_0_0/0.06)] dark:border-border">
      <div className="content-width flex flex-col gap-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <span className="inline-block rounded bg-destructive px-2 py-[5px] font-heading text-[8px] leading-none font-bold text-white">
            Limited Time
          </span>
          <h2 className="font-heading text-xl leading-tight font-bold">Mid-Season Sale — up to 30% off</h2>
          <p className="text-sm leading-normal font-medium text-muted-foreground opacity-85">
            Selected styles. No code needed. Discount applied at checkout.
          </p>
        </div>
        <Link
          href="/collections/sale"
          className="inline-flex h-[53px] w-fit shrink-0 items-center bg-primary px-8 text-sm leading-none font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Shop the Sale
        </Link>
      </div>
    </section>
  );
}
