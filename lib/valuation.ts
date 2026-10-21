import { TROY_OUNCE_GRAMS } from "@/lib/site";

export type Condition = "circulated" | "about-uncirculated" | "mint-state";
export type Packaging = "loose" | "box" | "box-papers";
export type Metal = "gold" | "silver" | "none";

export type SpotPrices = {
  goldUsd: number;
  silverUsd: number;
  usdGbp: number;
  goldGbp: number;
  silverGbp: number;
  source: "live" | "fallback";
  updatedAt: string;
};

export type IdentifiedCoin = {
  id: string;
  name: string;
  metal: Metal;
  weightGrams: number;
  purity: number;
  notes: string;
};

export type ValuationResult = {
  identified: IdentifiedCoin;
  quantity: number;
  condition: Condition;
  packaging: Packaging;
  fineMetalGrams: number;
  fineTroyOz: number;
  meltValue: number;
  margin: number;
  offerRate: number;
  offerPerCoin: number;
  offerTotal: number;
  isHighValueCollectible: boolean;
  highValueReason: string | null;
  year: number | null;
};

const GOLD_SOVEREIGN: IdentifiedCoin = {
  id: "sovereign",
  name: "Full Gold Sovereign",
  metal: "gold",
  weightGrams: 7.988,
  purity: 0.9167,
  notes: "22-carat gold; 7.98g standard weight used for UK Sovereigns.",
};

const HALF_SOVEREIGN: IdentifiedCoin = {
  id: "half-sovereign",
  name: "Half Sovereign",
  metal: "gold",
  weightGrams: 3.994,
  purity: 0.9167,
  notes: "22-carat gold; half the sovereign standard.",
};

const QUARTER_SOVEREIGN: IdentifiedCoin = {
  id: "quarter-sovereign",
  name: "Quarter Sovereign",
  metal: "gold",
  weightGrams: 1.997,
  purity: 0.9167,
  notes: "Modern 22-carat gold quarter sovereign.",
};

const GOLD_BRITANNIA_OZ: IdentifiedCoin = {
  id: "gold-britannia",
  name: "1oz Gold Britannia",
  metal: "gold",
  weightGrams: 31.103,
  purity: 0.9999,
  notes: "Bullion Britannia; modern issues are 999.9 fine gold.",
};

const SILVER_BRITANNIA_OZ: IdentifiedCoin = {
  id: "silver-britannia",
  name: "1oz Silver Britannia",
  metal: "silver",
  weightGrams: 31.103,
  purity: 0.999,
  notes: "Bullion Britannia; later issues 999 fine (earlier 958 Britannia silver).",
};

const KRUGERRAND: IdentifiedCoin = {
  id: "krugerrand",
  name: "1oz Krugerrand",
  metal: "gold",
  weightGrams: 33.93,
  purity: 0.9167,
  notes: "22-carat gold containing 1 troy ounce of fine gold.",
};

const GOLD_EAGLE: IdentifiedCoin = {
  id: "gold-eagle",
  name: "1oz American Gold Eagle",
  metal: "gold",
  weightGrams: 33.931,
  purity: 0.9167,
  notes: "22-carat gold eagle with 1 troy ounce of fine gold.",
};

const SILVER_EAGLE: IdentifiedCoin = {
  id: "silver-eagle",
  name: "American Silver Eagle",
  metal: "silver",
  weightGrams: 31.103,
  purity: 0.999,
  notes: "1 troy ounce of .999 fine silver.",
};

const MORGAN: IdentifiedCoin = {
  id: "morgan",
  name: "Morgan Silver Dollar",
  metal: "silver",
  weightGrams: 26.73,
  purity: 0.9,
  notes: "US 90% silver dollar (26.73g).",
};

const PEACE: IdentifiedCoin = {
  id: "peace",
  name: "Peace Silver Dollar",
  metal: "silver",
  weightGrams: 26.73,
  purity: 0.9,
  notes: "US 90% silver dollar (26.73g).",
};

const MAPLE_GOLD: IdentifiedCoin = {
  id: "maple-gold",
  name: "1oz Gold Maple Leaf",
  metal: "gold",
  weightGrams: 31.103,
  purity: 0.9999,
  notes: "Royal Canadian Mint 999.9 fine gold maple.",
};

const MAPLE_SILVER: IdentifiedCoin = {
  id: "maple-silver",
  name: "1oz Silver Maple Leaf",
  metal: "silver",
  weightGrams: 31.103,
  purity: 0.9999,
  notes: "Royal Canadian Mint 999.9 fine silver maple.",
};

const UNKNOWN: IdentifiedCoin = {
  id: "unidentified",
  name: "Unidentified coin — manual review",
  metal: "none",
  weightGrams: 0,
  purity: 0,
  notes: "We could not safely infer metal weight from the description. Barkan & Tamer will appraise from your photos.",
};

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9.\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractYear(description: string): number | null {
  const match = description.match(/\b(18|19|20)\d{2}\b/);
  if (!match) return null;
  const year = Number(match[0]);
  return year >= 1800 && year <= 2026 ? year : null;
}

function britishSilver(
  name: string,
  id: string,
  grams: number,
  year: number | null,
): IdentifiedCoin {
  const pre47 = year === null || year <= 1946;
  if (!pre47) {
    return {
      id: `${id}-cupro`,
      name: `${name} (post-1946 cupro-nickel)`,
      metal: "none",
      weightGrams: grams,
      purity: 0,
      notes: "UK circulating silver issues after 1946 contain no silver. Value is numismatic only.",
    };
  }
  return {
    id,
    name: `${name} (pre-1947 50% silver)`,
    metal: "silver",
    weightGrams: grams,
    purity: 0.5,
    notes: "Pre-1947 British silver is 50% fine. Sterling (92.5%) is used only when hallmarked or described as such.",
  };
}

export function identifyCoin(description: string): IdentifiedCoin {
  const text = normalize(description);
  const year = extractYear(description);
  const hasGold = /\bgold\b|\b22k\b|\b22 ct\b|\b22ct\b|\b24k\b/.test(text);
  const hasSilver = /\bsilver\b|\bsterling\b|\b925\b|\b999\b/.test(text);
  const sterling = /\bsterling\b|\b925\b/.test(text);

  if (/quarter sovereign/.test(text)) return QUARTER_SOVEREIGN;
  if (/half[- ]?sovereign/.test(text)) return HALF_SOVEREIGN;
  if (/\bsovereigns?\b/.test(text)) return GOLD_SOVEREIGN;
  if (/krugerrand/.test(text)) return KRUGERRAND;
  if (/maple/.test(text) && hasGold) return MAPLE_GOLD;
  if (/maple/.test(text)) return MAPLE_SILVER;
  if (/britannia/.test(text) && hasGold) return GOLD_BRITANNIA_OZ;
  if (/britannia/.test(text)) return SILVER_BRITANNIA_OZ;
  if (/(gold eagle|american gold eagle)/.test(text)) return GOLD_EAGLE;
  if (/(silver eagle|american silver eagle|walking liberty eagle)/.test(text)) {
    return SILVER_EAGLE;
  }
  if (/\bmorgan\b/.test(text)) return MORGAN;
  if (/\bpeace\b/.test(text) && /dollar|silver|coin/.test(text)) return PEACE;
  if (/half[- ]?crown|halfcrown/.test(text)) {
    return applySterling(britishSilver("Half Crown", "halfcrown", 14.14, year), sterling);
  }
  if (/\bflorin\b|\b2 shillings?\b/.test(text)) {
    return applySterling(britishSilver("Florin", "florin", 11.31, year), sterling);
  }
  if (/\bshillings?\b/.test(text)) {
    return applySterling(britishSilver("Shilling", "shilling", 5.655, year), sterling);
  }
  if (/\bsixpence\b|\b6d\b/.test(text)) {
    return applySterling(britishSilver("Sixpence", "sixpence", 2.827, year), sterling);
  }
  if (/\bcrowns?\b/.test(text) && !/half/.test(text)) {
    return applySterling(britishSilver("Crown", "crown", 28.276, year), sterling);
  }
  if (/walking liberty/.test(text)) {
    return {
      id: "walking-liberty",
      name: "Walking Liberty Half Dollar",
      metal: "silver",
      weightGrams: 12.5,
      purity: 0.9,
      notes: "US 90% silver half dollar.",
    };
  }
  if (hasGold) {
    return {
      id: "generic-gold",
      name: "Unspecified gold coin (conservative 1g 22k estimate)",
      metal: "gold",
      weightGrams: 1,
      purity: 0.9167,
      notes: "Description did not match a known type. Conservative 1g 22k used until inspection.",
    };
  }
  if (hasSilver) {
    return {
      id: "generic-silver",
      name: sterling
        ? "Unspecified sterling silver (conservative 5g at 92.5%)"
        : "Unspecified silver coin (conservative 5g at 50%)",
      metal: "silver",
      weightGrams: 5,
      purity: sterling ? 0.925 : 0.5,
      notes: "Description did not match a known type. Conservative weight used until inspection.",
    };
  }
  return UNKNOWN;
}

function applySterling(coin: IdentifiedCoin, sterling: boolean): IdentifiedCoin {
  if (!sterling || coin.metal !== "silver") return coin;
  return {
    ...coin,
    id: `${coin.id}-sterling`,
    name: coin.name.replace("50% silver", "sterling 92.5%"),
    purity: 0.925,
    notes: "Sterling (92.5%) applied because the listing mentioned sterling or 925.",
  };
}

const HIGH_VALUE_RULES: Array<{ test: (text: string, year: number | null) => boolean; reason: string }> = [
  {
    test: (t) => /1933/.test(t) && /penny|pence|sovereign/.test(t),
    reason: "1933 UK penny / related rarity — museum-level demand.",
  },
  {
    test: (t) => /kew gardens|kew/.test(t),
    reason: "Kew Gardens 50p is a modern key date with strong collector premiums.",
  },
  {
    test: (t) => /gothic crown|una and the lion|una & the lion/.test(t),
    reason: "Victorian proof/pattern crown territory — typically far above melt.",
  },
  {
    test: (t) => /edward viii/.test(t),
    reason: "Edward VIII patterns are extreme rarities.",
  },
  {
    test: (t, y) => /\bmorgan\b/.test(t) && (y === 1893 || y === 1895 || y === 1889 || /1893-?s|1889-?cc|1895|1893-?cc/.test(t)),
    reason: "Key-date Morgan Dollar (1893-S, 1889-CC, 1895 and related).",
  },
  {
    test: (t, y) => /\bpeace\b/.test(t) && (y === 1921 || y === 1928 || y === 1934 || /1928|1934-?s/.test(t)),
    reason: "Key-date Peace Dollar (1921 high relief, 1928, 1934-S).",
  },
  {
    test: (t) => /1933/.test(t) && /double eagle|eagle/.test(t),
    reason: "1933 Double Eagle is among the most valuable US coins.",
  },
  {
    test: (t) => /proof|pf70|ngc|pcgs|deep cameo|dcama/.test(t),
    reason: "Third-party graded proof/mint state coins often trade well above metal.",
  },
  {
    test: (t) => /\bmule\b|\berror\b|\bpattern\b/.test(t),
    reason: "Error, mule, or pattern coins require specialist pricing.",
  },
  {
    test: (t) => /1917-?p|1920-?s|1922-?s/.test(t) && /sovereign/.test(t),
    reason: "Scarce branch-mint Sovereign date/mint combinations.",
  },
];

export function detectHighValue(description: string): { flagged: boolean; reason: string | null } {
  const text = normalize(description);
  const year = extractYear(description);
  for (const rule of HIGH_VALUE_RULES) {
    if (rule.test(text, year)) return { flagged: true, reason: rule.reason };
  }
  return { flagged: false, reason: null };
}

export function getOfferRate(condition: Condition, packaging: Packaging): number {
  if (condition === "mint-state" && packaging === "box-papers") return 0.9;
  if (packaging === "box-papers" || packaging === "box") return 0.85;
  return 0.8;
}

export function getMarginLabel(rate: number): string {
  const margin = Math.round((1 - rate) * 100);
  return `${margin}% margin · you keep ${Math.round(rate * 100)}% of melt`;
}

export const CONDITION_LABEL: Record<Condition, string> = {
  circulated: "Circulated",
  "about-uncirculated": "About Uncirculated",
  "mint-state": "Mint State / Proof",
};

export const PACKAGING_LABEL: Record<Packaging, string> = {
  loose: "Loose Coin",
  box: "Box Only",
  "box-papers": "Box & Papers / CoA",
};

export type CoinItem = {
  id: string;
  description: string;
  quantity: number;
  condition: Condition;
  packaging: Packaging;
  photoCount: number;
};

export type CollectionLine = ValuationResult & {
  itemId: string;
  description: string;
  photoCount: number;
};

export type CollectionValuation = {
  lines: CollectionLine[];
  grandTotal: number;
  totalCoins: number;
  hasHighValue: boolean;
};

export function valueCoin(input: {
  description: string;
  quantity: number;
  condition: Condition;
  packaging: Packaging;
  spot: SpotPrices;
}): ValuationResult {
  const identified = identifyCoin(input.description);
  const year = extractYear(input.description);
  const high = detectHighValue(input.description);
  const offerRate = getOfferRate(input.condition, input.packaging);
  const quantity = Math.max(1, Math.min(999, Math.round(input.quantity) || 1));
  const fineMetalGrams = identified.weightGrams * identified.purity;
  const fineTroyOz = fineMetalGrams / TROY_OUNCE_GRAMS;
  const spotGbp =
    identified.metal === "gold"
      ? input.spot.goldGbp
      : identified.metal === "silver"
        ? input.spot.silverGbp
        : 0;
  const meltValue = roundMoney(fineTroyOz * spotGbp);
  const offerPerCoin = roundMoney(meltValue * offerRate);
  const offerTotal = roundMoney(offerPerCoin * quantity);

  return {
    identified,
    quantity,
    condition: input.condition,
    packaging: input.packaging,
    fineMetalGrams,
    fineTroyOz,
    meltValue,
    margin: 1 - offerRate,
    offerRate,
    offerPerCoin,
    offerTotal,
    isHighValueCollectible: high.flagged || identified.metal === "none",
    highValueReason: high.reason,
    year,
  };
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function valueCollection(items: CoinItem[], spot: SpotPrices): CollectionValuation {
  const lines = items.map((item) => {
    const valued = valueCoin({
      description: item.description,
      quantity: item.quantity,
      condition: item.condition,
      packaging: item.packaging,
      spot,
    });
    return {
      ...valued,
      itemId: item.id,
      description: item.description.trim(),
      photoCount: item.photoCount,
    };
  });

  return {
    lines,
    grandTotal: roundMoney(lines.reduce((sum, line) => sum + line.offerTotal, 0)),
    totalCoins: lines.reduce((sum, line) => sum + line.quantity, 0),
    hasHighValue: lines.some((line) => line.isHighValueCollectible),
  };
}
