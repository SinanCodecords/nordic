"use client";

import { Button } from "@/components/ui/button";
import CustomInput from "~/form-elements/CustomInput";
import CustomTextArea from "~/form-elements/CustomTextArea";

/**
 * Shopify has no contact-form API for headless stores, so this opens the shopper's email app with the
 * message filled in. TODO: swap for an email service (e.g. Resend) if the store wants an on-site form.
 */
export function ContactForm({ email }: { email: string }) {
  return (
    <form
      className="space-y-4 rounded-lg border p-5 sm:p-6"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const field = (name: string) => String(form.get(name) ?? "").trim();
        const order = field("order");
        const subject = order ? `Order ${order}: ${field("subject")}` : field("subject");
        const body = `${field("message")}\n\n${field("name")}`;
        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <CustomInput label="Name" name="name" autoComplete="name" required />
        <CustomInput label="Order number" name="order" placeholder="Optional, e.g. #1001" />
      </div>
      <CustomInput label="Subject" name="subject" required placeholder="How can we help?" />
      <CustomTextArea label="Message" name="message" rows={6} required />
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button type="submit">Send Message</Button>
        <p className="text-xs text-muted-foreground">Opens your email app with the message ready to send.</p>
      </div>
    </form>
  );
}
