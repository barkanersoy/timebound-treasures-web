import { SITE } from "@/lib/site";

/**
 * eBay data policy: never persist listing or user data.
 * - No database, files, cookies, or localStorage for eBay payloads.
 * - Listings are fetched live per request and returned only in the HTTP response.
 * - The only in-memory value we keep is a short-lived OAuth access token for our
 *   app credentials (not eBay end-user personal data).
 */
export const EBAY_SHOP_URL = SITE.ebayShop;
export const EBAY_SELLER = SITE.ebaySeller;
export const EBAY_MARKETPLACE = "EBAY_GB";
export const EBAY_LISTING_LIMIT = 6;

export type EbayListing = {
  id: string;
  title: string;
  category: string;
  price: number | null;
  currency: string;
  imageUrl: string | null;
  href: string;
  condition: string | null;
};

export type EbayFeed = {
  configured: boolean;
  shopUrl: string;
  seller: string;
  listings: EbayListing[];
  error?: string;
};

type TokenCache = { value: string; expiresAt: number };

/** Ephemeral app OAuth token only — never listing or user payloads. */
let accessTokenCache: TokenCache | null = null;

type BrowseItem = {
  itemId?: string;
  title?: string;
  itemWebUrl?: string;
  condition?: string;
  price?: { value?: string; currency?: string };
  image?: { imageUrl?: string };
  thumbnailImages?: Array<{ imageUrl?: string }>;
  categories?: Array<{ categoryName?: string }>;
};

function credentials() {
  const clientId = process.env.EBAY_CLIENT_ID?.trim();
  const clientSecret = process.env.EBAY_CLIENT_SECRET?.trim();
  return clientId && clientSecret ? { clientId, clientSecret } : null;
}

function emptyFeed(error?: string): EbayFeed {
  return {
    configured: Boolean(credentials()),
    shopUrl: EBAY_SHOP_URL,
    seller: EBAY_SELLER,
    listings: [],
    error,
  };
}

async function getAccessToken(): Promise<string> {
  const keys = credentials();
  if (!keys) throw new Error("eBay API keys are not configured");

  if (accessTokenCache && Date.now() < accessTokenCache.expiresAt) {
    return accessTokenCache.value;
  }

  const basic = Buffer.from(`${keys.clientId}:${keys.clientSecret}`).toString("base64");
  const response = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
    cache: "no-store",
  });

  const payload = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };

  if (!response.ok || !payload.access_token) {
    throw new Error(payload.error_description ?? "eBay token request failed");
  }

  accessTokenCache = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(30, (payload.expires_in ?? 7200) - 60) * 1000,
  };
  return accessTokenCache.value;
}

function mapItem(item: BrowseItem): EbayListing | null {
  const href = item.itemWebUrl;
  if (!href) return null;
  const priceValue = Number(item.price?.value);
  return {
    id: item.itemId ?? href,
    title: item.title?.trim() || "eBay listing",
    category: item.categories?.[0]?.categoryName?.trim() || "Coins",
    price: Number.isFinite(priceValue) ? priceValue : null,
    currency: item.price?.currency || "GBP",
    imageUrl: item.image?.imageUrl ?? item.thumbnailImages?.[0]?.imageUrl ?? null,
    href,
    condition: item.condition?.trim() || null,
  };
}

export async function getEbayListings(): Promise<EbayFeed> {
  if (!credentials()) {
    return emptyFeed();
  }

  try {
    const token = await getAccessToken();
    // Browse API rejects ultra-broad queries like q=* even with a seller filter.
    // Use a coin-focused keyword still scoped to our seller account.
    const params = new URLSearchParams({
      q: "coin",
      limit: String(EBAY_LISTING_LIMIT),
      sort: "newlyListed",
      filter: `sellers:{${EBAY_SELLER}}`,
    });

    const response = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-EBAY-C-MARKETPLACE-ID": EBAY_MARKETPLACE,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const payload = (await response.json()) as {
      itemSummaries?: BrowseItem[];
      errors?: Array<{ message?: string }>;
    };

    if (!response.ok) {
      throw new Error(payload.errors?.[0]?.message ?? `eBay search failed (${response.status})`);
    }

    const listings = (payload.itemSummaries ?? [])
      .map(mapItem)
      .filter((item): item is EbayListing => item !== null)
      .slice(0, EBAY_LISTING_LIMIT);

    // Return live data only — do not cache listings on the server.
    return {
      configured: true,
      shopUrl: EBAY_SHOP_URL,
      seller: EBAY_SELLER,
      listings,
    };
  } catch (error) {
    return emptyFeed(error instanceof Error ? error.message : "Could not load eBay listings");
  }
}
