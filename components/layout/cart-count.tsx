import { cookies } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { Suspense } from "react";
import { getCartQuantity } from "@/lib/shopify";
import { CART_COOKIE } from "@/lib/shopify/cart";

/** The number on the bag icon. It reads the cart cookie, so it streams in after the (prerendered) header. */
export function CartCount() {
  return (
    <Suspense fallback={null}>
      <CartCountForVisitor />
    </Suspense>
  );
}

async function CartCountForVisitor() {
  const id = (await cookies()).get(CART_COOKIE)?.value;
  if (!id) return null;

  let count = 0;
  try {
    count = await getCartQuantity(id);
  } catch (error) {
    unstable_rethrow(error);
    return null; // No badge beats a broken header.
  }
  if (!count) return null;

  return (
    <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] leading-none font-semibold text-primary-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}
