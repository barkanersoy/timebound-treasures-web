"use client";

import { useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { SITE } from "@/lib/site";

export type SectionId = "valuation" | "shop" | "about" | "guide";
export type MainTab = "sell" | "buy";

const LINKS: Array<{ label: string; section: SectionId; tab?: MainTab }> = [
  { label: "Sell Coins", section: "valuation", tab: "sell" },
  { label: "eBay Shop", section: "shop", tab: "buy" },
  { label: "About Us", section: "about" },
  { label: "Coin Collector Guide", section: "guide" },
];

type HeaderProps = {
  onNavigate: (section: SectionId, tab?: MainTab) => void;
};

export function Header({ onNavigate }: HeaderProps) {
  const [open, setOpen] = useState(false);

  function handle(section: SectionId, tab?: MainTab) {
    setOpen(false);
    onNavigate(section, tab);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy/85 backdrop-blur-xl">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-gold focus:px-3 focus:py-2 focus:text-navy"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          onClick={() => onNavigate("valuation", "sell")}
          className="flex items-center gap-3 text-left"
        >
          <BrandLogo size={48} priority />
          <span>
            <span className="block font-serif text-lg leading-tight text-white sm:text-xl">
              {SITE.name}
            </span>
            <span className="hidden max-w-[16rem] text-[11px] leading-snug tracking-wide text-muted sm:block lg:max-w-xs">
              {SITE.tagline}
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handle(link.section, link.tab)}
              className="rounded-full px-3 py-2 text-sm text-slate-200 transition hover:bg-white/5 hover:text-gold"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <p className="hidden shrink-0 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-medium text-gold xl:inline-flex">
            📍 {SITE.appointmentNote}
          </p>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span aria-hidden className="text-lg">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-white/10 px-4 py-4 lg:hidden">
          <p className="mb-3 rounded-full border border-gold/30 bg-gold/10 px-3 py-2 text-center text-xs font-medium text-gold">
            📍 {SITE.appointmentNote}
          </p>
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handle(link.section, link.tab)}
                className="rounded-lg px-3 py-3 text-left text-sm text-slate-100 hover:bg-white/5"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
