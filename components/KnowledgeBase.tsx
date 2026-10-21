"use client";

import { useMemo, useState } from "react";
import { GUIDE_COINS } from "@/lib/coins";

export function KnowledgeBase() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState<"All" | "British" | "United States">("All");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return GUIDE_COINS.filter((coin) => {
      const regionOk = region === "All" || coin.region === region;
      if (!regionOk) return false;
      if (!needle) return true;
      const haystack = [
        coin.name,
        coin.metal,
        coin.purity,
        coin.keyDates,
        coin.collectibility,
        coin.mintage,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query, region]);

  return (
    <section id="guide" className="border-b border-white/10 bg-navy-deep/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Coin collector guide
        </p>
        <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
          British & US Reference Desk
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Search mintage, purity and key dates before you sell. Melt is the floor;
          key dates, proofs and original packaging are where Barkan & Tamer look twice.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label className="block flex-1 text-sm">
            <span className="sr-only">Search the coin guide</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Sovereign, Morgan, Kew Gardens…"
              className="w-full rounded-2xl border border-white/10 bg-card px-4 py-3 text-white outline-none ring-gold placeholder:text-slate-500 focus:ring-2"
            />
          </label>
          <fieldset className="flex rounded-2xl border border-white/10 bg-card p-1">
            <legend className="sr-only">Filter by region</legend>
            {(["All", "British", "United States"] as const).map((option) => (
              <label
                key={option}
                className={`cursor-pointer rounded-xl px-3 py-2 text-sm ${
                  region === option ? "bg-gold text-navy" : "text-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="region"
                  className="sr-only"
                  checked={region === option}
                  onChange={() => setRegion(option)}
                />
                {option}
              </label>
            ))}
          </fieldset>
        </div>

        <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10">
          <table className="min-w-[860px] w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              Popular British and United States coins with mintage, purity and key dates
            </caption>
            <thead className="bg-card text-xs uppercase tracking-wide text-gold">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Coin
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Metal / purity
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Weight
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Mintage
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Key dates
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Collectibility
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((coin) => (
                <tr key={coin.id} className="border-t border-white/10 align-top">
                  <th scope="row" className="px-4 py-4 font-medium text-white">
                    {coin.name}
                    <span className="mt-1 block text-xs font-normal text-muted">{coin.region}</span>
                  </th>
                  <td className="px-4 py-4 text-slate-300">
                    {coin.metal}
                    <span className="mt-1 block text-xs text-muted">{coin.purity}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{coin.typicalWeight}</td>
                  <td className="px-4 py-4 text-slate-300">{coin.mintage}</td>
                  <td className="px-4 py-4 text-slate-300">{coin.keyDates}</td>
                  <td className="px-4 py-4 text-slate-400">{coin.collectibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-muted">No coins match that search.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
