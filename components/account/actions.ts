"use server";

import { refresh } from "next/cache";
import {
  type AddressInput,
  createAddress,
  customerAccountsEnabled,
  deleteAddress,
  setEmailMarketing,
  updateAddress,
  updateCustomerName,
} from "@/lib/shopify/customer";
import { NOT_CONNECTED } from "./shared";

export type AccountActionResult = { error?: string; ok?: boolean };

async function run(fn: () => Promise<unknown>, fallback: string): Promise<AccountActionResult> {
  if (!customerAccountsEnabled) return { error: NOT_CONNECTED };
  try {
    await fn();
  } catch (error) {
    console.error(error);
    return { error: error instanceof Error && error.message ? error.message : fallback };
  }
  refresh();
  return { ok: true };
}

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();

export async function saveProfile(_: AccountActionResult, form: FormData) {
  const firstName = text(form, "firstName");
  const lastName = text(form, "lastName");
  if (!firstName) return { error: "Please enter your first name." };
  return run(() => updateCustomerName({ firstName, lastName }), "Couldn't save your profile.");
}

export async function saveAddress(_: AccountActionResult, form: FormData) {
  const address: AddressInput = {
    firstName: text(form, "firstName"),
    lastName: text(form, "lastName"),
    company: text(form, "company") || null,
    address1: text(form, "address1"),
    address2: text(form, "address2") || null,
    city: text(form, "city"),
    zip: text(form, "zip"),
    zoneCode: text(form, "zoneCode").toUpperCase() || null,
    countryCode: text(form, "countryCode") || null,
    phoneNumber: text(form, "phoneNumber") || null,
  };
  if (!address.address1 || !address.city || !address.countryCode) {
    return { error: "Please fill in the street, city and country." };
  }
  const id = text(form, "id");
  const isDefault = form.get("default") === "on";
  return run(
    () => (id ? updateAddress(id, address, isDefault) : createAddress(address, isDefault)),
    "Couldn't save this address.",
  );
}

export async function removeAddress(id: string) {
  return run(() => deleteAddress(id), "Couldn't delete this address.");
}

export async function updateEmailMarketing(subscribed: boolean) {
  return run(() => setEmailMarketing(subscribed), "Couldn't update your email preferences.");
}
