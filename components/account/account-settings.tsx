"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import CustomInput from "~/form-elements/CustomInput";
import CustomSelect from "~/form-elements/CustomSelect";
import { DemoButton } from "./demo-button";
import { NOT_CONNECTED } from "./shared";
import { AccountCard } from "./ui";

// Figma "Account Settings". None of these exist in Shopify's customer API, so they're demo only:
// customers sign in with an emailed code (no password), language/currency come from Shopify Markets,
// and accounts are deleted by the store on request.

const PASSWORD_MESSAGE = "Shopify accounts sign in with a one-time code sent by email, so there's no password to change.";

export function AccountSettings() {
  return (
    <div className="max-w-[758px] space-y-6">
      <AccountCard>
        <h3 className="text-base leading-6 font-semibold tracking-[-0.31px]">Password</h3>
        <p className="pt-1 type-body text-muted-foreground">Update your password to keep your account secure.</p>
        <form
          className="space-y-3 pt-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast(PASSWORD_MESSAGE);
          }}
        >
          <CustomInput type="password" aria-label="Current password" placeholder="Current password" autoComplete="current-password" />
          <CustomInput type="password" aria-label="New password" placeholder="New password" autoComplete="new-password" />
          <CustomInput
            type="password"
            aria-label="Confirm new password"
            placeholder="Confirm new password"
            autoComplete="new-password"
          />
          <Button type="submit" className="mt-1">
            Update Password
          </Button>
        </form>
      </AccountCard>

      <AccountCard>
        <h3 className="text-base leading-6 font-semibold tracking-[-0.31px]">Language &amp; Region</h3>
        <p className="pt-1 type-body text-muted-foreground">Set your preferred language and currency.</p>
        <div className="grid gap-4 pt-4 sm:grid-cols-2">
          <CustomSelect
            label="Language"
            options={["English", "Deutsch", "Français", "Svenska"]}
            defaultValue="English"
            className="w-full"
            onValueChange={() => toast(NOT_CONNECTED)}
          />
          <CustomSelect
            label="Currency"
            options={["USD ($)", "EUR (€)", "GBP (£)", "SEK (kr)"]}
            defaultValue="USD ($)"
            className="w-full"
            onValueChange={() => toast(NOT_CONNECTED)}
          />
        </div>
      </AccountCard>

      <AccountCard className="border-destructive">
        <h3 className="text-base leading-6 font-semibold tracking-[-0.31px] text-destructive">Danger Zone</h3>
        <p className="pt-1 type-body text-muted-foreground">Permanently delete your account and all associated data.</p>
        <DemoButton
          variant="destructive"
          className="mt-4"
          message="Account deletion isn't connected yet. Please contact us and we'll delete your account."
        >
          Delete Account
        </DemoButton>
      </AccountCard>
    </div>
  );
}
