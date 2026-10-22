import { NextResponse } from "next/server";
import { getEbayListings } from "@/lib/ebay";

export const dynamic = "force-dynamic";

export async function GET() {
  const feed = await getEbayListings();
  return NextResponse.json(feed, {
    headers: {
      // Do not cache eBay listing payloads in browsers or CDNs.
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
