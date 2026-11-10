"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { CustomerAddress } from "@/lib/shopify/customer";
import ConfirmationDialog from "~/ConfirmationDialog";
import { removeAddress } from "./actions";
import { AddressDialog } from "./address-dialog";

export function AddAddressButton() {
  return (
    <AddressDialog
      trigger={
        <Button size="sm" className="text-xs">
          <Plus /> Add Address
        </Button>
      }
    />
  );
}

export function AddressCardActions({ address, isDefault }: { address: CustomerAddress; isDefault: boolean }) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  const onDelete = () =>
    startTransition(async () => {
      const { error } = await removeAddress(address.id);
      setConfirming(false);
      if (error) toast.error(error);
      else toast.success("Address deleted");
    });

  return (
    <div className="flex gap-2 pt-4">
      <AddressDialog
        address={address}
        isDefault={isDefault}
        trigger={
          <Button size="sm" className="text-xs">
            <Pencil className="size-3.5" /> Edit
          </Button>
        }
      />
      <Button
        size="sm"
        variant="ghost"
        className="text-xs text-destructive hover:text-destructive"
        // Shopify won't delete the default address; another one must be made default first.
        disabled={isDefault}
        title={isDefault ? "Make another address your default before deleting this one" : undefined}
        onClick={() => setConfirming(true)}
      >
        <Trash2 className="size-3.5" /> Delete
      </Button>
      <ConfirmationDialog
        isOpen={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={onDelete}
        loading={pending}
        title="Delete this address?"
        description="It will be removed from your account."
        confirmText="Delete"
        confirmVariant="destructive"
      />
    </div>
  );
}
