"use client";

import { useSyncExternalStore } from "react";
import { getCookie, setCookie } from "@/lib/utils/cookies";
import { parseList } from "./shared";

/** Browser side of a cookie list: read, write, toggle, and a hook that re-renders on change. */
export function createCookieList(name: string, max: number) {
  const event = `cookie-list:${name}`;

  const read = () => parseList(getCookie(name), max);

  const write = (handles: string[]) => {
    setCookie(name, encodeURIComponent(handles.slice(0, max).join(",")), 30);
    window.dispatchEvent(new Event(event));
  };

  /** Adds or removes a handle, or reports "full" when the list is at its maximum. */
  const toggle = (handle: string): "added" | "removed" | "full" => {
    const list = read();
    if (list.includes(handle)) {
      write(list.filter((h) => h !== handle));
      return "removed";
    }
    if (list.length >= max) return "full";
    write([...list, handle]);
    return "added";
  };

  const subscribe = (onChange: () => void) => {
    window.addEventListener(event, onChange);
    window.addEventListener("focus", onChange); // another tab may have changed it
    return () => {
      window.removeEventListener(event, onChange);
      window.removeEventListener("focus", onChange);
    };
  };
  // The raw cookie string keeps the snapshot stable between renders.
  const snapshot = () => getCookie(name) ?? "";

  const useList = () => parseList(useSyncExternalStore(subscribe, snapshot, () => ""), max);

  return { read, write, toggle, useList };
}
