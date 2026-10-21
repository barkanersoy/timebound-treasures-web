import { NextResponse } from "next/server";
import type { SpotPrices } from "@/lib/valuation";

const FALLBACK: SpotPrices = {
  goldUsd: 3950,
  silverUsd: 48.5,
  usdGbp: 0.76,
  goldGbp: 3950 * 0.76,
  silverGbp: 48.5 * 0.76,
  source: "fallback",
  updatedAt: new Date().toISOString(),
};

async function readJson(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed ${url}`);
  return response.json();
}

export async function GET() {
  try {
    const [gold, silver, fx] = await Promise.all([
      readJson("https://api.gold-api.com/price/XAU"),
      readJson("https://api.gold-api.com/price/XAG"),
      readJson("https://api.frankfurter.app/latest?from=USD&to=GBP"),
    ]);

    const goldUsd = Number(gold?.price);
    const silverUsd = Number(silver?.price);
    const usdGbp = Number(fx?.rates?.GBP);

    if (![goldUsd, silverUsd, usdGbp].every((n) => Number.isFinite(n) && n > 0)) {
      throw new Error("Invalid spot payload");
    }

    const payload: SpotPrices = {
      goldUsd,
      silverUsd,
      usdGbp,
      goldGbp: goldUsd * usdGbp,
      silverGbp: silverUsd * usdGbp,
      source: "live",
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" },
    });
  } catch {
    return NextResponse.json(FALLBACK, { status: 200 });
  }
}
