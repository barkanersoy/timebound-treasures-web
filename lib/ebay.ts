import { SITE } from "@/lib/site";

export const EBAY_SHOP_URL = SITE.ebayShop;
export const EBAY_SELLER = SITE.ebaySeller;
export const EBAY_MARKETPLACE = "EBAY_GB";
export const EBAY_LISTING_LIMIT = 12;

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
type ListingCache = { feed: EbayFeed; expiresAt: number };

let tokenCache: TokenCache | null = null;
let listingCache: ListingCache | null = null;

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

  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.value;
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

  tokenCache = {
    value: payload.access_token,
    expiresAt: Date.now() + Math.max(30, (payload.expires_in ?? 7200) - 60) * 1000,
  };
  return tokenCache.value;
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
  if (listingCache && Date.now() < listingCache.expiresAt) {
    return listingCache.feed;
  }

  if (!credentials()) {
    return emptyFeed();
  }

  try {
    const token = await getAccessToken();
    const params = new URLSearchParams({
      q: "*",
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

    const feed: EbayFeed = {
      configured: true,
      shopUrl: EBAY_SHOP_URL,
      seller: EBAY_SELLER,
      listings,
    };
    listingCache = { feed, expiresAt: Date.now() + 5 * 60 * 1000 };
    return feed;
  } catch (error) {
    return emptyFeed(error instanceof Error ? error.message : "Could not load eBay listings");
  }
}
