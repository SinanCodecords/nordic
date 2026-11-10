"use client";

import { useActionState } from "react";
import { toast } from "sonner";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";
import { type AccountActionResult, saveProfile } from "./actions";
import { DemoButton } from "./demo-button";

type Props = { firstName: string; lastName: string; email: string; phone: string };

/** Figma "Profile Settings". Shopify lets customers change their name only; email and phone come from login. */
export function ProfileForm({ firstName, lastName, email, phone }: Props) {
  const [, formAction, pending] = useActionState(async (prev: AccountActionResult, form: FormData) => {
    const result = await saveProfile(prev, form);
    if (result.ok) toast.success("Profile saved");
    else if (result.error) toast.error(result.error);
    return result;
  }, {});

  const initial = (firstName || email || "?").charAt(0).toUpperCase();

  return (
    <form action={formAction} className="max-w-[498px] space-y-5 rounded-lg border p-5 sm:p-6">
      <div className="flex items-center gap-4">
        <span className="grid size-16 place-items-center rounded-full bg-elevated type-ui-heading" aria-hidden>
          {initial}
        </span>
        <DemoButton size="sm" className="text-xs" message="Profile photos aren't supported by Shopify accounts yet.">
          Change Avatar
        </DemoButton>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CustomInput label="First Name" name="firstName" defaultValue={firstName} autoComplete="given-name" required />
        <CustomInput label="Last Name" name="lastName" defaultValue={lastName} autoComplete="family-name" />
      </div>
      <CustomInput
        label="Email"
        type="email"
        defaultValue={email}
        readOnly
        description="This is the email you sign in with."
        className="text-muted-foreground"
      />
      <CustomInput
        label="Phone"
        type="tel"
        defaultValue={phone}
        readOnly
        placeholder="Not added"
        className="text-muted-foreground"
      />
      <CustomInput
        label="Date of Birth"
        type="date"
        name="birthday"
        description="Not saved yet: Shopify accounts don't store a birthday."
      />

      <SubmitButton isLoading={pending}>Save Changes</SubmitButton>
    </form>
  );
}
