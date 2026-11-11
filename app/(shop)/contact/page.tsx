import { Mail, Package, RotateCcw, Truck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { policyHref, STORE } from "@/lib/store-info";
import CustomBreadcrumb from "~/CustomBreadcrumb";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Questions about an order or a product? ${STORE.replyTime}`,
};

const HELP_LINKS = [
  { icon: Package, label: "Track your order", href: "/track-order" },
  { icon: Truck, label: "Shipping policy", href: policyHref("shipping-policy") },
  { icon: RotateCcw, label: "Returns & refunds", href: policyHref("refund-policy") },
];

// Not in the Figma file; uses the same fields, cards and type scale as the account pages.
export default function ContactPage() {
  return (
    <div className="content-width pt-9 pb-24">
      <CustomBreadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Contact Us", isCurrentPage: true }]}
        currentClassName="font-medium"
      />
      <h1 className="pt-4 type-page-title">Contact Us</h1>
      <p className="pt-2 type-body text-muted-foreground">
        Questions about an order, a product or a return? Send us a message. {STORE.replyTime}
      </p>

      <div className="grid gap-8 pt-8 lg:grid-cols-[1fr_360px]">
        <ContactForm email={STORE.email} />

        <aside className="space-y-6">
          <div className="rounded-lg border p-5">
            <h2 className="type-label">Email us</h2>
            <a
              href={`mailto:${STORE.email}`}
              className="mt-2 flex items-center gap-2 type-body text-muted-foreground hover:text-foreground"
            >
              <Mail className="size-4" />
              {STORE.email}
            </a>
          </div>
          <div className="rounded-lg border p-5">
            <h2 className="type-label">Quick help</h2>
            <ul className="pt-2">
              {HELP_LINKS.map(({ icon: Icon, label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="-mx-2 flex h-10 items-center gap-3 rounded-md px-2 type-body text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
