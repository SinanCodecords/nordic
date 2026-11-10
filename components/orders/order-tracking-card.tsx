import { format } from "date-fns";
import { Check, ExternalLink, Truck } from "lucide-react";
import { formatPrice } from "@/lib/shopify/helpers";
import type { CustomerOrder } from "@/lib/shopify/customer";
import { cn } from "@/lib/utils";
import { STEPS, trackOrder } from "./tracking";

const date = (iso: string) => format(new Date(iso), "MMM d, yyyy");

export function OrderTrackingCard({ order }: { order: CustomerOrder }) {
  const { step, label, problem, fulfillment } = trackOrder(order);
  const tracking = fulfillment?.trackingInformation.find((t) => t.number || t.url);
  const items = order.lineItems.nodes;

  return (
    <article className="rounded-lg border">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b p-5">
        <div>
          <h2 className="font-heading text-base leading-6 font-semibold">Order {order.name}</h2>
          <p className="type-body text-muted-foreground">
            Placed {date(order.processedAt)} · {formatPrice(order.totalPrice)}
          </p>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 type-badge",
            problem ? "border-destructive/30 text-destructive" : step === 3 ? "border-success/30 text-success" : "",
          )}
        >
          {label}
        </span>
      </header>

      <div className="space-y-6 p-5">
        {step >= 0 && <ProgressBar step={step} />}

        <dl className="grid gap-4 type-body sm:grid-cols-3">
          {fulfillment?.estimatedDeliveryAt && step < 3 && (
            <div>
              <dt className="text-muted-foreground">Estimated delivery</dt>
              <dd className="font-medium">{date(fulfillment.estimatedDeliveryAt)}</dd>
            </div>
          )}
          {tracking && (
            <div>
              <dt className="text-muted-foreground">{tracking.company ?? "Tracking number"}</dt>
              <dd className="flex items-center gap-2 font-medium">
                {tracking.number}
                {tracking.url && (
                  <a
                    href={tracking.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                  >
                    <Truck className="size-3.5" /> Track package
                  </a>
                )}
              </dd>
            </div>
          )}
          <div className="sm:col-span-full">
            <dt className="text-muted-foreground">Items</dt>
            <dd>
              <ul>
                {items.map((item, i) => (
                  <li key={i}>
                    {item.quantity} × {item.title}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      <footer className="border-t px-5 py-3">
        {/* Shopify's own order status page: full details, shipping address, receipts. */}
        <a
          href={order.statusPageUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 type-label text-muted-foreground hover:text-foreground"
        >
          View order details <ExternalLink className="size-3.5" />
        </a>
      </footer>
    </article>
  );
}

function ProgressBar({ step }: { step: number }) {
  return (
    <ol className="grid grid-cols-4" aria-label="Delivery progress">
      {STEPS.map((name, i) => {
        const done = i <= step;
        return (
          <li key={name} className="relative flex flex-col items-center gap-2 text-center" aria-current={i === step ? "step" : undefined}>
            {i > 0 && (
              <span
                aria-hidden
                className={cn("absolute top-3.5 right-1/2 h-0.5 w-full -translate-y-1/2", done ? "bg-selected" : "bg-border")}
              />
            )}
            <span
              className={cn(
                "relative z-10 grid size-7 place-items-center rounded-full border-2 bg-background",
                done ? "border-selected bg-selected text-background" : "text-muted-foreground",
              )}
            >
              {done ? <Check className="size-3.5 stroke-3" /> : <span className="size-1.5 rounded-full bg-current" />}
            </span>
            <span className={cn("text-xs leading-4", done ? "font-medium" : "text-muted-foreground")}>{name}</span>
          </li>
        );
      })}
    </ol>
  );
}
