import type { CustomerFulfillment, CustomerOrder } from "@/lib/shopify/customer";

/** The four steps of the tracking bar. */
export const STEPS = ["Ordered", "Shipped", "Out for delivery", "Delivered"] as const;

export type Tracking = {
  /** Index into STEPS, or -1 when the order was cancelled. */
  step: number;
  /** Short status for the badge, e.g. "In transit". */
  label: string;
  /** Something went wrong (delayed, failed delivery…), shown in red. */
  problem: boolean;
  fulfillment: CustomerFulfillment | null;
};

const SHIPMENT: Record<string, { step: number; label: string; problem?: boolean }> = {
  LABEL_PURCHASED: { step: 0, label: "Preparing to ship" },
  LABEL_PRINTED: { step: 0, label: "Preparing to ship" },
  CONFIRMED: { step: 1, label: "Shipped" },
  CARRIER_PICKED_UP: { step: 1, label: "Shipped" },
  IN_TRANSIT: { step: 1, label: "In transit" },
  DELAYED: { step: 1, label: "Delayed", problem: true },
  ATTEMPTED_DELIVERY: { step: 2, label: "Delivery attempted", problem: true },
  FAILURE: { step: 2, label: "Delivery failed", problem: true },
  OUT_FOR_DELIVERY: { step: 2, label: "Out for delivery" },
  READY_FOR_PICKUP: { step: 2, label: "Ready for pickup" },
  DELIVERED: { step: 3, label: "Delivered" },
  PICKED_UP: { step: 3, label: "Picked up" },
};

/** Works out where an order is from Shopify's fulfilment data. Uses the most recently updated shipment. */
export function trackOrder(order: CustomerOrder): Tracking {
  const fulfillment =
    order.fulfillments.nodes
      .filter((f) => f.status !== "CANCELLED")
      .toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0] ?? null;

  if (order.cancelledAt) return { step: -1, label: "Cancelled", problem: true, fulfillment };

  if (fulfillment?.latestShipmentStatus && SHIPMENT[fulfillment.latestShipmentStatus]) {
    return { problem: false, ...SHIPMENT[fulfillment.latestShipmentStatus], fulfillment };
  }
  // Fulfilled but the carrier hasn't sent any updates yet.
  if (fulfillment || order.fulfillmentStatus === "FULFILLED") {
    return { step: 1, label: "Shipped", problem: false, fulfillment };
  }
  return { step: 0, label: "Processing", problem: false, fulfillment: null };
}
