"use client";

import { useCallback, useEffect, useState } from "react";
import { About } from "@/components/About";
import { EbayGallery } from "@/components/EbayGallery";
import { Footer } from "@/components/Footer";
import { Header, type MainTab, type SectionId } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { KnowledgeBase } from "@/components/KnowledgeBase";
import { QuoteBuilder } from "@/components/QuoteBuilder";
import { ValueProps } from "@/components/ValueProps";
import type { SpotPrices } from "@/lib/valuation";

export function HomePage() {
  const [tab, setTab] = useState<MainTab>("sell");
  const [spot, setSpot] = useState<SpotPrices | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/spot")
      .then((response) => response.json())
      .then((payload: SpotPrices) => {
        if (!cancelled) setSpot(payload);
      })
      .catch(() => {
        /* wizard still works once fallback arrives from the route */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const onNavigate = useCallback((section: SectionId, nextTab?: MainTab) => {
    if (nextTab) setTab(nextTab);
    const targetId = section === "shop" ? "marketplace" : section;
    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  return (
    <div className="flex min-h-full flex-col">
      <Header onNavigate={onNavigate} />
      <main id="main" className="flex-1">
        <Hero onNavigate={onNavigate} spot={spot} />
        <ValueProps />
        <section id="marketplace" className="border-b border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div
              role="tablist"
              aria-label="Buy or sell"
              className="mb-8 inline-flex rounded-full border border-white/10 bg-card p-1"
            >
              <button
                type="button"
                role="tab"
                aria-selected={tab === "sell"}
                id="tab-sell"
                onClick={() => setTab("sell")}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${
                  tab === "sell" ? "bg-gold text-navy" : "text-slate-300"
                }`}
              >
                Sell
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "buy"}
                id="tab-buy"
                onClick={() => setTab("buy")}
                className={`rounded-full px-5 py-2 text-sm font-semibold ${
                  tab === "buy" ? "bg-gold text-navy" : "text-slate-300"
                }`}
              >
                Buy
              </button>
            </div>
            <div
              id="valuation"
              role="tabpanel"
              aria-labelledby="tab-sell"
              hidden={tab !== "sell"}
            >
              {tab === "sell" ? (
                <QuoteBuilder
                  goldSpotGBP={spot?.goldGbp ?? null}
                  silverSpotGBP={spot?.silverGbp ?? null}
                />
              ) : null}
            </div>
            <div id="shop" role="tabpanel" aria-labelledby="tab-buy" hidden={tab !== "buy"}>
              {tab === "buy" ? <EbayGallery /> : null}
            </div>
          </div>
        </section>
        <About />
        <KnowledgeBase />
      </main>
      <Footer />
    </div>
  );
}
