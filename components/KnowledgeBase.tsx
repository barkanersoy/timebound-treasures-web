"use client";

import { useEffect, useMemo, useState } from "react";
import { GUIDE_COINS } from "@/lib/coins";

const PAGE_SIZE = 10;

export function KnowledgeBase() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return GUIDE_COINS.filter((coin) => {
      if (!needle) return true;
      const haystack = [
        coin.name,
        coin.metalPurity,
        coin.keyDates,
        coin.collectibility,
        coin.mintage,
        coin.typicalWeight,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageRows = rows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [query]);

  return (
    <section id="guide" className="border-b border-white/10 bg-navy-deep/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          Coin Collector Guide
        </p>
        <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
          Coin Reference Desk
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
          Search mintage, purity and key dates before you sell. Melt is the floor; key dates,
          proofs and original packaging are where Barkan & Tamer look twice.
        </p>

        <div className="mt-6">
          <label className="block text-sm">
            <span className="sr-only">Search the coin guide</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Sovereign, Morgan, Kew Gardens, Krugerrand…"
              className="w-full rounded-2xl border border-white/10 bg-card px-4 py-3 text-white outline-none ring-gold placeholder:text-slate-500 focus:ring-2"
            />
          </label>
        </div>

        <div className="mt-6 overflow-x-auto rounded-3xl border border-white/10">
          <table className="min-w-[860px] w-full border-collapse text-left text-sm">
            <caption className="sr-only">
              Popular gold and silver coins with mintage, purity and key dates
            </caption>
            <thead className="bg-card text-xs uppercase tracking-wide text-gold">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Coin
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Metal / Purity
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Weight
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Mintage
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Key Dates
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Collectibility
                </th>
              </tr>
            </thead>
            <tbody>
              {pageRows.map((coin) => (
                <tr key={coin.id} className="border-t border-white/10 align-top">
                  <th scope="row" className="px-4 py-4 font-medium text-white">
                    {coin.name}
                  </th>
                  <td className="px-4 py-4 text-slate-300">{coin.metalPurity}</td>
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

        {rows.length > 0 ? (
          <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-xs text-slate-400">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, rows.length)} of {rows.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <span className="min-w-[5.5rem] text-center text-xs text-slate-300">
                Page {safePage} of {pageCount}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={safePage >= pageCount}
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-slate-200 transition hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
