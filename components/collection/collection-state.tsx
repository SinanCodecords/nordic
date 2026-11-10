"use client";

import { useQueryStates } from "nuqs";
import { createContext, type ReactNode, type TransitionStartFunction, use, useTransition } from "react";
import { collectionParsers } from "./params";

const PendingContext = createContext<{ pending: boolean; startTransition: TransitionStartFunction } | null>(null);

/** Shares one loading state between the filters, the toolbar and the product grid. */
export function CollectionStateProvider({ children }: { children: ReactNode }) {
  const [pending, startTransition] = useTransition();
  return <PendingContext value={{ pending, startTransition }}>{children}</PendingContext>;
}

/** Reads and writes the URL filters. Each change asks the server for the new product list. */
export function useCollectionParams() {
  const ctx = use(PendingContext);
  return useQueryStates(collectionParsers, {
    shallow: false,
    scroll: false,
    startTransition: ctx?.startTransition,
  });
}

/** Dims the products while the server is working on a filter change. */
export function PendingArea({ children, className }: { children: ReactNode; className?: string }) {
  const pending = use(PendingContext)?.pending ?? false;
  return (
    <div aria-busy={pending} className={className} data-pending={pending || undefined}>
      {children}
    </div>
  );
}
