import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { shopifyFetch } from "./client";

export type MenuLink = { label: string; href: string };

type MenuItem = { title: string; url: string | null; type: string };

/**
 * Shopify gives full store addresses (https://store.myshopify.com/collections/men); the site needs its own
 * paths. Shopify's /pages/contact becomes our /contact, and the "all collections" page becomes /collections/all.
 */
function toHref({ url, type }: MenuItem) {
  if (!url) return null;
  if (type === "HTTP") return url;
  if (type === "COLLECTIONS") return "/collections/all";
  const { pathname, search } = new URL(url);
  return pathname.replace(/^\/pages\//, "/") + search;
}

async function fetchMenu(handle: string): Promise<MenuLink[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("menus");

  const data = await shopifyFetch<{ menu: { items: MenuItem[] } | null }>(
    /* GraphQL */ `
      query getMenu($handle: String!) {
        menu(handle: $handle) {
          items {
            title
            url
            type
          }
        }
      }
    `,
    { handle },
  );
  return (data.menu?.items ?? []).flatMap((item) => {
    const href = toHref(item);
    return href ? [{ label: item.title, href }] : [];
  });
}

/**
 * A menu from Shopify admin → Content → Menus (e.g. "main-menu"). Uses `fallback` when the menu is empty
 * or Shopify can't be reached, so the header never ends up without links.
 */
export async function getMenu(handle: string, fallback: MenuLink[]): Promise<MenuLink[]> {
  const links = await fetchMenu(handle).catch(() => []);
  return links.length ? links : fallback;
}
