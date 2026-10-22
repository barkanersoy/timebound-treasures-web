"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { EBAY_SHOP_URL, type EbayFeed, type EbayListing } from "@/lib/ebay";
import { formatGbp } from "@/lib/format";

function priceLabel(listing: EbayListing) {
  if (listing.price == null) return "See price on eBay";
  if (listing.currency === "GBP") return formatGbp(listing.price);
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: listing.currency,
    maximumFractionDigits: 2,
  }).format(listing.price);
}

export function EbayGallery() {
  const [feed, setFeed] = useState<EbayFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetch("/api/ebay", { cache: "no-store" })
      .then(async (response) => {
        const payload = (await response.json()) as EbayFeed;
        if (!response.ok) {
          throw new Error(payload.error ?? `Could not load listings (${response.status})`);
        }
        return payload;
      })
      .then((payload) => {
        if (!cancelled) {
          setFeed(payload);
          setLoading(false);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setFeed({
            configured: true,
            shopUrl: EBAY_SHOP_URL,
            seller: "timeboundtreasures",
            listings: [],
            error: error instanceof Error ? error.message : "Could not reach the eBay feed",
          });
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const shopUrl = feed?.shopUrl ?? EBAY_SHOP_URL;
  const listings = feed?.listings ?? [];
  const showListings = listings.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-3xl text-white">eBay Shop</h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-300">
            Recent Live listings from{" "}
            <span className="text-gold">timeboundtreasures</span> on eBay UK. Click to
            open the item in a new tab.
          </p>
        </div>
        <a
          href={shopUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-gold/50 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold/10"
        >
          Open eBay profile
        </a>
      </div>

      {loading && !showListings ? (
        <p className="mt-8 text-sm text-slate-400">Loading latest listings…</p>
      ) : showListings ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <li
              key={listing.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-card"
            >
              <div className="relative aspect-[4/3] bg-navy-deep">
                <Image
                  src={listing.imageUrl ?? "/pouch.jpg"}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  unoptimized={Boolean(listing.imageUrl)}
                />
                <span className="absolute left-3 top-3 rounded-full bg-navy/80 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
                  {listing.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-serif text-lg leading-snug text-white">{listing.title}</h3>
                {listing.condition ? (
                  <p className="mt-2 text-xs text-slate-400">{listing.condition}</p>
                ) : null}
                <p className="mt-3 text-lg font-semibold text-gold">{priceLabel(listing)}</p>
                <a
                  href={listing.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-gold px-3 py-2 text-sm font-semibold text-navy hover:bg-gold-dark"
                >
                  View on eBay
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-8 rounded-3xl border border-white/10 bg-card px-6 py-10 text-center">
          <p className="font-serif text-2xl text-white">
            {feed?.error ? "Couldn’t load live listings" : "No active listings right now"}
          </p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-300">
            {feed?.error
              ? "The eBay feed didn’t respond. Retry, or browse the full shop while we reconnect."
              : "When new coins go up on eBay UK they will appear here automatically."}
          </p>
          {feed?.error ? (
            <p className="mt-3 text-xs text-amber-200">{feed.error}</p>
          ) : null}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setReloadKey((key) => key + 1)}
              className="inline-flex items-center justify-center rounded-full border border-gold/50 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/10"
            >
              Retry live listings
            </button>
            <a
              href={shopUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold-dark"
            >
              Browse timeboundtreasures on eBay
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
