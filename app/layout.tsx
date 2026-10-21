import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Timebound Treasures | Buy & Sell Gold, Silver & Rare Coins in West London",
  description:
    "Barkan and Tamer pay top prices for gold, silver and rare coins in West London. Instant valuations linked to live metal spot prices, 15-minute payouts, and a curated eBay shop.",
  keywords: [
    "sell gold coins London",
    "sell silver coins West London",
    "Sovereign buyers",
    "Morgan Dollar",
    "Peace Dollar",
    "Britannia coins",
    "coin valuation",
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-navy font-sans text-foreground">{children}</body>
    </html>
  );
}
