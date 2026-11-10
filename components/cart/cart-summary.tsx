import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Cart, formatPrice } from "@/lib/shopify";
import { checkout } from "./actions";
import { CouponForm } from "./coupon-form";

export function CartSummary({ cart }: { cart: Cart }) {
  const { subtotalAmount, totalAmount } = cart.cost;
  const savings = Number(subtotalAmount.amount) - Number(totalAmount.amount);
  const applied = cart.discountCodes.find((d) => d.applicable)?.code;

  return (
    <aside className="h-fit rounded-lg border p-6 lg:sticky lg:top-24">
      <h2 className="type-ui-heading">Order Summary</h2>

      <div className="pt-5">
        <CouponForm applied={applied} />
      </div>

      <dl className="mt-5 space-y-3 border-y py-5 type-body">
        <Row label={`Subtotal (${cart.totalQuantity} ${cart.totalQuantity === 1 ? "item" : "items"})`}>
          {formatPrice(subtotalAmount)}
        </Row>
        {savings > 0 && (
          <Row label="Discount">
            <span className="text-success">−{formatPrice({ ...totalAmount, amount: String(savings) })}</span>
          </Row>
        )}
        <Row label="Shipping & taxes">
          <span className="text-muted-foreground">Calculated at checkout</span>
        </Row>
      </dl>

      <div className="flex items-baseline justify-between py-5">
        <span className="type-label">Total</span>
        <span className="font-heading text-2xl leading-8 font-semibold">{formatPrice(totalAmount)}</span>
      </div>

      {/* Shopify hosts checkout: address, shipping and payment. */}
      <form action={checkout}>
        <Button type="submit" size="lg" className="w-full">
          <Lock /> Checkout
        </Button>
      </form>
      <p className="pt-3 text-center text-xs text-muted-foreground">
        Free shipping on orders over $50. 30-day free returns.
      </p>
    </aside>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{children}</dd>
    </div>
  );
}
