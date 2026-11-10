"use client";

import { useId, useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { updateEmailMarketing } from "./actions";
import { NOT_CONNECTED } from "./shared";

type Row = { key: string; title: string; text: string; defaultOn: boolean };

// Figma "Notification Preferences". Only the newsletter maps to Shopify (email marketing consent);
// the rest need an email app (e.g. Klaviyo or Shopify Email automations) before they do anything.
const PROMOTIONS: Row = { key: "promotions", title: "Promotions & Offers", text: "Sale alerts and exclusive member offers.", defaultOn: true };
const ARRIVALS: Row = { key: "arrivals", title: "New Arrivals", text: "Be the first to know about new collections.", defaultOn: false };
const PRICE_DROPS: Row = { key: "price-drops", title: "Price Drop Alerts", text: "Get notified when wishlist items go on sale.", defaultOn: true };
const REVIEWS: Row = { key: "reviews", title: "Review Reminders", text: "Reminders to review products you purchased.", defaultOn: false };

export function NotificationSettings({ subscribed }: { subscribed: boolean }) {
  return (
    <ul className="max-w-[761px] divide-y rounded-lg border">
      {/* Order emails are always sent by Shopify. */}
      <SettingRow title="Order Updates" text="Notifications about your order status and delivery." checked disabled />
      <DemoRow row={PROMOTIONS} />
      <DemoRow row={ARRIVALS} />
      <DemoRow row={PRICE_DROPS} />
      <NewsletterRow subscribed={subscribed} />
      <DemoRow row={REVIEWS} />
    </ul>
  );
}

/** Saved to Shopify as the customer's email marketing consent. */
function NewsletterRow({ subscribed }: { subscribed: boolean }) {
  const [optimistic, setOptimistic] = useOptimistic(subscribed);
  const [pending, startTransition] = useTransition();

  const onChange = (next: boolean) =>
    startTransition(async () => {
      setOptimistic(next);
      const { error } = await updateEmailMarketing(next);
      if (error) toast.error(error);
      else toast.success(next ? "Subscribed to the newsletter" : "Unsubscribed from the newsletter");
    });

  return (
    <SettingRow
      title="Newsletter"
      text="Weekly style updates and editorial content."
      checked={optimistic}
      disabled={pending}
      onChange={onChange}
    />
  );
}

/** Switches without a backend yet: they flip on screen and say so. */
function DemoRow({ row }: { row: Row }) {
  const [on, setOn] = useState(row.defaultOn);
  return (
    <SettingRow
      title={row.title}
      text={row.text}
      checked={on}
      onChange={(next) => {
        setOn(next);
        toast(NOT_CONNECTED);
      }}
    />
  );
}

function SettingRow({
  title,
  text,
  checked,
  disabled,
  onChange,
}: {
  title: string;
  text: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (next: boolean) => void;
}) {
  const id = useId();
  return (
    <li className="flex items-center justify-between gap-6 p-4">
      <label htmlFor={id} className="min-w-0">
        <span className="block type-label">{title}</span>
        <span className="block pt-0.5 type-body text-muted-foreground">{text}</span>
      </label>
      <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </li>
  );
}
