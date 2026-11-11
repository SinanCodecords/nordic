import { Gem, RotateCcw, Truck } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { STORE } from "@/lib/store-info";
import CustomBreadcrumb from "~/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "About Us",
  description: `${STORE.tagline} Learn what Nordic stands for.`,
};

// Not in the Figma file; built from the same type scale, cards and images as the rest of the site.
// TODO: replace the copy with the brand's own story.
const VALUES = [
  {
    icon: Gem,
    title: "Made to last",
    text: "We pick pieces for their materials and finish, so they still look right after years of wear.",
  },
  {
    icon: Truck,
    title: "Free shipping over $50",
    text: "Standard delivery is on us for orders over $50, with express options at checkout.",
  },
  {
    icon: RotateCcw,
    title: "30-day free returns",
    text: "Not quite right? Send it back within 30 days, unworn with tags attached, at no cost.",
  },
];

export default function AboutPage() {
  return (
    <div className="content-width pt-9 pb-24">
      <CustomBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "About Us", isCurrentPage: true }]}
        currentClassName="font-medium"
      />

      <section className="grid items-center gap-10 pt-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="type-eyebrow text-muted-foreground">About {STORE.name}</p>
          <h1 className="pt-3 font-heading text-4xl leading-[1.1] font-bold tracking-[-1px] sm:text-5xl">
            {STORE.tagline}
          </h1>
          <p className="max-w-[520px] pt-5 text-base leading-7 tracking-[-0.31px] text-muted-foreground">
            {STORE.name} brings together clothing, shoes, accessories and tech in one place, chosen for clean design
            and everyday use. Fewer, better things, without the guesswork.
          </p>
          <div className="flex flex-wrap gap-3 pt-7">
            <Button asChild>
              <Link href="/collections/new-arrivals">Shop New Arrivals</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-elevated">
          <Image
            src="/images/marketing/hero-on-lime.png"
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="pt-20">
        <h2 className="type-section-heading">What we stand for</h2>
        <ul className="grid gap-6 pt-6 md:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-lg border p-6">
              <span className="grid size-11 place-items-center rounded-full bg-elevated">
                <Icon className="size-5 stroke-[1.5]" />
              </span>
              <h3 className="pt-4 type-label">{title}</h3>
              <p className="pt-1 type-body text-muted-foreground">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 flex flex-col items-center rounded-2xl bg-elevated px-6 py-14 text-center">
        <h2 className="type-section-heading">Questions? We&apos;re here to help.</h2>
        <p className="max-w-md pt-2 type-body text-muted-foreground">{STORE.replyTime}</p>
        <div className="flex flex-wrap justify-center gap-3 pt-6">
          <Button asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/track-order">Track an Order</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
