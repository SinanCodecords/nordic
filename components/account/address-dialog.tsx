"use client";

import { type ReactNode, useActionState, useState } from "react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { CustomerAddress } from "@/lib/shopify/customer";
import CustomInput from "~/form-elements/CustomInput";
import CustomSelect from "~/form-elements/CustomSelect";
import SubmitButton from "~/form-elements/SubmitButton";
import { type AccountActionResult, saveAddress } from "./actions";

// Countries offered in the form. Add the markets the store ships to.
const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "GB", label: "United Kingdom" },
  { value: "IE", label: "Ireland" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "NL", label: "Netherlands" },
  { value: "SE", label: "Sweden" },
  { value: "NO", label: "Norway" },
  { value: "DK", label: "Denmark" },
  { value: "FI", label: "Finland" },
  { value: "AU", label: "Australia" },
  { value: "IN", label: "India" },
  { value: "AE", label: "United Arab Emirates" },
];

type Props = {
  address?: CustomerAddress;
  isDefault?: boolean;
  trigger: ReactNode;
};

/** Add / edit address form in a dialog. Saves to Shopify, then the page re-renders. */
export function AddressDialog({ address, isDefault = false, trigger }: Props) {
  const [open, setOpen] = useState(false);
  // Close after a save; show Shopify's message when it refuses the address.
  const [, formAction, pending] = useActionState(async (prev: AccountActionResult, form: FormData) => {
    const result = await saveAddress(prev, form);
    if (result.ok) {
      setOpen(false);
      toast.success(address ? "Address updated" : "Address added");
    } else if (result.error) {
      toast.error(result.error);
    }
    return result;
  }, {});

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{address ? "Edit Address" : "Add Address"}</DialogTitle>
          <DialogDescription>Used for delivery and pre-filled at checkout.</DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-4 sm:grid-cols-2">
          {address && <input type="hidden" name="id" value={address.id} />}
          <CustomInput label="First Name" name="firstName" defaultValue={address?.firstName ?? ""} autoComplete="given-name" />
          <CustomInput label="Last Name" name="lastName" defaultValue={address?.lastName ?? ""} autoComplete="family-name" />
          <CustomInput
            label="Street Address"
            name="address1"
            required
            defaultValue={address?.address1 ?? ""}
            autoComplete="address-line1"
            wrapperClass="sm:col-span-2"
          />
          <CustomInput
            label="Apartment, suite, etc."
            name="address2"
            defaultValue={address?.address2 ?? ""}
            autoComplete="address-line2"
            wrapperClass="sm:col-span-2"
          />
          <CustomInput label="City" name="city" required defaultValue={address?.city ?? ""} autoComplete="address-level2" />
          <CustomInput
            label="State / Province code"
            name="zoneCode"
            placeholder="e.g. OR"
            defaultValue={address?.zoneCode ?? ""}
            autoComplete="address-level1"
          />
          <CustomInput label="ZIP / Postal Code" name="zip" defaultValue={address?.zip ?? ""} autoComplete="postal-code" />
          <CustomSelect
            label="Country"
            name="countryCode"
            required
            options={COUNTRIES}
            defaultValue={address?.countryCode ?? "US"}
            className="w-full"
          />
          <CustomInput
            label="Phone"
            name="phoneNumber"
            type="tel"
            defaultValue={address?.phoneNumber ?? ""}
            autoComplete="tel"
            wrapperClass="sm:col-span-2"
          />
          <label className="flex items-center gap-2 type-body sm:col-span-2">
            {/* The default address can't be "un-defaulted"; pick another one as default instead. */}
            <Checkbox name="default" defaultChecked={isDefault} disabled={isDefault} />
            Use as my default address
          </label>
          <SubmitButton isLoading={pending} className="sm:col-span-2">{address ? "Save Address" : "Add Address"}</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
}
