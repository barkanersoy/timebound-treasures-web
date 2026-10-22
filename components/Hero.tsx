"use client";

import { SITE } from "@/lib/site";
import type { MainTab, SectionId } from "@/components/Header";
import { HeroStoryReel } from "@/components/HeroStoryReel";
import { formatGbp } from "@/lib/format";
import type { SpotPrices } from "@/lib/valuation";

const TRUST = [
  "Live Market Valuation",
  "Immediate Payouts",
  "Private Appraisals",
] as const;

type HeroProps = {
  onNavigate: (section: SectionId, tab?: MainTab) => void;
  spot: SpotPrices | null;
};

export function Hero({ onNavigate, spot }: HeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_42%),radial-gradient(circle_at_bottom_left,rgba(30,41,59,0.9),transparent_50%)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
        <div>
          <p className="mb-5 inline-flex rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
            Independent numismatists · {SITE.location}
          </p>
          <h1 className="max-w-xl font-serif text-[2.05rem] leading-[1.18] tracking-[-0.018em] text-white sm:max-w-2xl sm:text-[2.75rem] sm:leading-[1.14] lg:max-w-none lg:text-[3.35rem] lg:leading-[1.12] lg:tracking-[-0.022em]">
            Sell{" "}
            <span className="text-amber-400">Gold, Silver & Rare Coins</span>{" "}
            directly to London’s Trusted Dealers.
          </h1>
          <p className="mt-5 max-w-xl text-[0.95rem] leading-7 text-slate-300 sm:text-lg sm:leading-8">
            Get fair, transparent valuations calculated against live market spot rates.
            Enjoy instant payment and fully insured doorstep collection — private
            consultations available for substantial collections.
          </p>
          <ul className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
            {TRUST.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 text-sm font-medium tracking-wide text-slate-200"
              >
                <span aria-hidden className="text-amber-400">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onNavigate("valuation", "sell")}
              className="inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-gold-dark"
            >
              Request a Valuation
            </button>
            <button
              type="button"
              onClick={() => onNavigate("shop", "buy")}
              className="inline-flex items-center justify-center rounded-full border border-gold/60 px-6 py-3 text-sm font-semibold text-gold transition hover:bg-gold/10"
            >
              Shop the eBay Store
            </button>
          </div>
          {spot ? (
            <dl className="mt-8 grid max-w-lg grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-white/10 bg-card/80 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-muted">Gold spot</dt>
                <dd className="mt-1 font-semibold text-white">
                  {formatGbp(spot.goldGbp)}
                  <span className="ml-1 text-xs font-normal text-muted">/oz</span>
                </dd>
              </div>
              <div className="rounded-2xl border border-white/10 bg-card/80 px-4 py-3">
                <dt className="text-xs uppercase tracking-wide text-muted">Silver spot</dt>
                <dd className="mt-1 font-semibold text-white">
                  {formatGbp(spot.silverGbp)}
                  <span className="ml-1 text-xs font-normal text-muted">/oz</span>
                </dd>
              </div>
            </dl>
          ) : null}
        </div>
        <div className="relative">
          <HeroStoryReel />
        </div>
      </div>
    </section>
  );
}
