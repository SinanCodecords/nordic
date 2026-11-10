"use client";

import { toast } from "sonner";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";

// TODO: connect to Shopify email marketing. Until then it only confirms on screen.
export function NewsletterForm() {
  return (
    <form
      className="mx-auto flex w-full max-w-[438px] flex-col gap-3 sm:flex-row sm:gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        toast("Newsletter sign-up isn't connected yet.");
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
      <SubmitButton className="h-9 rounded-none bg-primary px-5 text-xs font-semibold text-primary-foreground hover:bg-primary/90">
        Subscribe
      </SubmitButton>
    </form>
  );
}
