"use client";

import { useSyncExternalStore } from "react";
import { getCookie, setCookie } from "@/lib/utils/cookies";
import { COMPARE_COOKIE, MAX_COMPARE, parseCompare } from "./shared";

// The compare list lives in a cookie (product handles, comma-separated) so the /compare page
// can read it on the server. This file is the browser side: read, write, and re-render on change.

const EVENT = "compare-change";

export function readCompare(): string[] {
  return parseCompare(getCookie(COMPARE_COOKIE));
}

export function writeCompare(handles: string[]) {
  setCookie(COMPARE_COOKIE, encodeURIComponent(handles.slice(0, MAX_COMPARE).join(",")), 30);
  window.dispatchEvent(new Event(EVENT));
}

/** Adds or removes a product, or reports "full" when the list already has the maximum. */
export function toggleCompare(handle: string): "added" | "removed" | "full" {
  const list = readCompare();
  if (list.includes(handle)) {
    writeCompare(list.filter((h) => h !== handle));
    return "removed";
  }
  if (list.length >= MAX_COMPARE) return "full";
  writeCompare([...list, handle]);
  return "added";
}

const subscribe = (onChange: () => void) => {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("focus", onChange); // another tab may have changed it
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("focus", onChange);
  };
};

/** The raw cookie string keeps the snapshot stable between renders. */
const snapshot = () => getCookie(COMPARE_COOKIE) ?? "";

export function useCompareList(): string[] {
  return parseCompare(useSyncExternalStore(subscribe, snapshot, () => ""));
}
