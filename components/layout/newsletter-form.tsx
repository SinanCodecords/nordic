"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/lib/klaviyo";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";

/** Adds the email to the Klaviyo newsletter list (see lib/klaviyo.ts). */
export function NewsletterForm() {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="mx-auto flex w-full max-w-[438px] flex-col gap-3 sm:flex-row sm:gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = String(new FormData(form).get("email") ?? "").trim();
        startTransition(async () => {
          const { error } = await subscribeToNewsletter(email);
          if (error) return void toast(error);
          toast.success("Thanks! You're on the list.");
          form.reset();
        });
      }}
    >
      <CustomInput
        type="email"
        name="email"
        required
        aria-label="Email address"
        placeholder="ex. youremail2025@yahoo.com"
        wrapperClass="flex-1"
        className="h-9 rounded-none border-transparent bg-field text-[13.7px] shadow-none placeholder:text-placeholder"
      />
      <SubmitButton
        isLoading={pending}
        className="h-9 rounded-none bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
      >
        Subscribe
      </SubmitButton>
    </form>
  );
}
