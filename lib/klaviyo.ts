// Newsletter sign-ups go to a Klaviyo list. Klaviyo's "client" endpoint is made to be called from the
// browser with the public site ID (no secret key), so this file is safe to use in client components.
// Docs: https://developers.klaviyo.com/en/reference/create_client_subscription

const COMPANY_ID = process.env.NEXT_PUBLIC_KLAVIYO_COMPANY_ID;
const LIST_ID = process.env.NEXT_PUBLIC_KLAVIYO_LIST_ID;

export const newsletterEnabled = Boolean(COMPANY_ID && LIST_ID);

export const NEWSLETTER_NOT_CONNECTED = "Newsletter sign-up isn't connected yet.";

export async function subscribeToNewsletter(email: string): Promise<{ error?: string }> {
  if (!COMPANY_ID || !LIST_ID) return { error: NEWSLETTER_NOT_CONNECTED };

  try {
    const res = await fetch(`https://a.klaviyo.com/client/subscriptions?company_id=${encodeURIComponent(COMPANY_ID)}`, {
      method: "POST",
      headers: { "Content-Type": "application/vnd.api+json", revision: "2026-10-15" },
      body: JSON.stringify({
        data: {
          type: "subscription",
          attributes: {
            custom_source: "Website footer",
            profile: {
              data: {
                type: "profile",
                attributes: { email, subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } } },
              },
            },
          },
          relationships: { list: { data: { type: "list", id: LIST_ID } } },
        },
      }),
    });
    if (res.ok) return {};

    const body = (await res.json().catch(() => null)) as { errors?: { detail?: string }[] } | null;
    return { error: body?.errors?.[0]?.detail ?? "Couldn't subscribe right now. Please try again." };
  } catch {
    return { error: "Couldn't reach the newsletter service. Please try again." };
  }
}
