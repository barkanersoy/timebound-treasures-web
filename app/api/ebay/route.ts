import { NextResponse } from "next/server";
import { getEbayListings } from "@/lib/ebay";

export async function GET() {
  const feed = await getEbayListings();
  return NextResponse.json(feed, {
    headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" },
  });
}
