"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { NOT_CONNECTED } from "./shared";

/**
 * A Figma button for something Shopify's customer API doesn't offer (saved cards, password,
 * account deletion…). It only explains that it isn't connected.
 */
export function DemoButton({ message = NOT_CONNECTED, ...props }: React.ComponentProps<typeof Button> & { message?: string }) {
  return <Button type="button" {...props} onClick={() => toast(message)} />;
}
