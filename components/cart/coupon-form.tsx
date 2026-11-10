"use client";

import { useActionState } from "react";
import CustomInput from "~/form-elements/CustomInput";
import SubmitButton from "~/form-elements/SubmitButton";
import { applyCoupon } from "./actions";

export function CouponForm({ applied }: { applied?: string }) {
  const [state, formAction, pending] = useActionState(applyCoupon, {});

  return (
    <form action={formAction} className="space-y-2">
      <div className="flex gap-2">
        <CustomInput
          name="coupon"
          aria-label="Discount code"
          defaultValue={applied}
          placeholder="Discount code"
          wrapperClass="flex-1"
          className="h-9 uppercase placeholder:normal-case"
        />
        <SubmitButton isLoading={pending} variant="outline" className="h-9">
          Apply
        </SubmitButton>
      </div>
      {state.error ? (
        <p className="text-xs text-destructive" role="alert">
          {state.error}
        </p>
      ) : (
        applied && <p className="text-xs font-medium text-success">Code {applied} applied</p>
      )}
    </form>
  );
}
