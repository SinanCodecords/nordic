# Shopify Setup

Follow these steps once. At the end you'll have a `.env` file with all the keys.

## 1. Add the Headless channel
- Shopify admin → **Settings → Apps and sales channels → Shopify App Store**
- Install **Headless** (by Shopify)
- Go to **Headless → Create storefront** → name it **Nordic**

## 2. Store keys
- In Nordic storefront → **Storefront API → Manage**
- Copy the **Private access token**
- Note your store address: `something.myshopify.com`
- Under **Permissions**, tick products, collections, cart/checkout, customers → **Save**

## 3. Customer accounts
- **Settings → Customer accounts** → choose **Customer accounts** (not Legacy)

## 4. Login keys
- In Nordic storefront → **Customer Account API → Manage**
- Set client type to **Public**
- Copy the **Client ID**
- Copy the **Shop ID** (the number in `shopify.com/authentication/12345678`)

## 5. HTTPS address (for testing on your computer)
- Sign up at **ngrok.com** (free)
- Claim your free **static domain**, e.g. `nordic-abc.ngrok-free.app`

## 6. Add your address to Shopify
On the same Customer Account API page:

| Field | Value |
|---|---|
| Callback URI | `https://nordic-abc.ngrok-free.app/account/authorize` |
| JavaScript origin | `https://nordic-abc.ngrok-free.app` |
| Logout URI | `https://nordic-abc.ngrok-free.app` |

Add your real domain the same way when you go live.

## 7. Show products on the website
- Open each product → under **Sales channels**, tick **Headless (Nordic)**

## 8. Make a secret
Run this in Terminal and copy the result:

```bash
openssl rand -base64 32
```

## 9. Create `.env` in the project root

```
SHOPIFY_STORE_DOMAIN=something.myshopify.com
SHOPIFY_STOREFRONT_PRIVATE_TOKEN=     # step 2
SHOPIFY_API_VERSION=2026-07
SHOPIFY_SHOP_ID=                      # step 4
SHOPIFY_CUSTOMER_CLIENT_ID=           # step 4
SESSION_SECRET=                       # step 8
NEXT_PUBLIC_BASE_URL=https://nordic-abc.ngrok-free.app
```

Never share or commit this file.

## 10. Store policies
- **Settings → Policies** → write (or generate) Shipping, Refund, Privacy and Terms of Service
- They show on the site at `/policies/...` (linked from the footer)

## 11. Reviews (Judge.me)
- Install **Judge.me Product Reviews** from the Shopify App Store
- Judge.me → **Settings → Integrations → View API token** → copy the **Private API token**
- Add to `.env`: `JUDGEME_PRIVATE_TOKEN=`

## 12. Newsletter (Klaviyo)
- Install **Klaviyo** from the Shopify App Store and create a list (e.g. "Newsletter")
- Klaviyo → **Settings → API keys** → copy the **Public API key / Site ID** (6 characters)
- Klaviyo → **Lists & segments** → your list → **Settings** → copy the **List ID**
- Add to `.env`:
  ```
  NEXT_PUBLIC_KLAVIYO_COMPANY_ID=
  NEXT_PUBLIC_KLAVIYO_LIST_ID=
  ```

## 13. Support email
- Put your real support address in `lib/store-info.ts` (shown on Contact and used by the contact form)

## 14. Send shoppers back to this site after checkout
Checkout and the order confirmation page are always hosted by Shopify. Their "Continue shopping" button and
logo link to the Shopify Online Store (`something.myshopify.com`), so make that store forward every visit here:

- **Online Store → Themes → ⋯ → Edit code**
- Paste this as the first thing inside `<head>` in `layout/theme.liquid`, then **Save**.
  Leave `layout/password.liquid` alone: while the store password is on, checkout sends shoppers to that page
  to type the password, and forwarding it would make checkout impossible.

```liquid
{%- unless request.design_mode -%}
<script>
  // Everything is on the headless site. Same paths, except Shopify's /pages/contact becomes /contact.
  location.replace("https://nordic-puce.vercel.app" + location.pathname.replace(/^\/pages\//, "/") + location.search);
</script>
{%- endunless -%}
```

Change the address when the site moves to its own domain.

## Optional
- Want to test coupons? Create one in **Discounts**.
- Store has a password? Checkout will ask for it while testing. That's normal.
