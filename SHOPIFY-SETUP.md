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

## Optional
- Want to test coupons? Create one in **Discounts**.
- Store has a password? Checkout will ask for it while testing. That's normal.
