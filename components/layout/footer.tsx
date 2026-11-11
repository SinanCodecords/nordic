import { ArrowUp } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { STORE } from "@/lib/store-info";
import { FOOTER_COLUMNS, SOCIAL_LINKS } from "./data";
import { NewsletterForm } from "./newsletter-form";

export function Footer() {
  return (
    <footer className="bg-elevated pt-12 pb-10">
      <div className="content-width">
        <Newsletter />

        <div className="grid gap-10 pt-14 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-3 max-w-[240px] text-sm leading-5 tracking-[-0.24px] text-foreground-secondary">
              {STORE.tagline} Clothing, shoes, accessories and tech, chosen to be used for years.
            </p>
            <ul className="mt-5 flex gap-2.5">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid size-[35px] place-items-center rounded-full border border-brand bg-hero-cta text-white transition-opacity hover:opacity-80"
                  >
                    <Icon className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm leading-5 font-semibold tracking-[-0.24px]">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm leading-5 tracking-[-0.24px] text-foreground-secondary hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative mt-14 border-t pt-6 text-center text-sm leading-5 tracking-[-0.24px]">
          © 2026 <span className="font-semibold">NORDIC</span>. All rights reserved.
          <a
            href="#top"
            aria-label="Back to top"
            className="absolute top-3.5 right-0 grid size-10 place-items-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-80"
          >
            <ArrowUp className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function Newsletter() {
  return (
    <section className="flex min-h-[337px] flex-col items-center justify-center gap-7 rounded-2xl bg-card px-6 py-9 text-center shadow-[0_1px_3px_rgb(0_0_0/0.04)]">
      <div className="space-y-2">
        <h2 className="font-heading text-2xl leading-[31px] font-bold tracking-[-0.24px]">Join the list</h2>
        <p className="text-[13.7px] leading-5 tracking-[-0.24px] text-muted-foreground">
          Get early access to new collections, members-only offers, and 10% off your first order.
        </p>
      </div>
      <NewsletterForm />
    </section>
  );
}
