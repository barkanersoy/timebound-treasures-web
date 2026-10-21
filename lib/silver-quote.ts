import { z } from "zod";

export const TROY_OUNCE_GRAMS = 31.1034768;

export const EvaluatedCoinSchema = z.object({
  identifiedName: z.string().describe("Recognised coin name, e.g. Pre-1947 Shilling"),
  metalType: z
    .enum(["silver", "none"])
    .describe("silver when bullion content exists; none for cupro-nickel or non-silver"),
  purityDecimal: z
    .number()
    .min(0)
    .max(1)
    .describe("Fine silver fraction: 0.925, 0.5, or 0"),
  grossWeightGrams: z.number().nonnegative().describe("Standard coin weight in grams"),
  fineMetalGramsPerCoin: z.number().nonnegative(),
  fineMetalOuncesPerCoin: z.number().nonnegative(),
  rawMeltValuePerCoinGBP: z.number().nonnegative(),
  notes: z.string().describe("Brief appraisal notes for the dealer and customer"),
});

export type EvaluatedCoin = z.infer<typeof EvaluatedCoinSchema>;

export const QuoteRequestSchema = z.object({
  userInput: z.string().min(1).max(500),
  silverSpotGBP: z.number().positive(),
});

type SilverIdentity = {
  identifiedName: string;
  purityDecimal: number;
  grossWeightGrams: number;
  notes: string;
};

function normalize(input: string): string {
  return input
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9.\s/-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractYear(description: string): number | null {
  const match = description.match(/\b(18|19|20)\d{2}\b/);
  if (!match) return null;
  const year = Number(match[0]);
  return year >= 1800 && year <= 2100 ? year : null;
}

function ukSilverPurity(year: number | null, forceSterling: boolean): number {
  if (forceSterling) return 0.925;
  if (year === null) return 0.5;
  if (year < 1920) return 0.925;
  if (year <= 1946) return 0.5;
  return 0;
}

function ukDenomination(
  name: string,
  grams: number,
  year: number | null,
  forceSterling: boolean,
): SilverIdentity {
  const purityDecimal = ukSilverPurity(year, forceSterling);
  if (purityDecimal === 0) {
    return {
      identifiedName: `${name} (post-1946 cupro-nickel)`,
      purityDecimal: 0,
      grossWeightGrams: grams,
      notes: "UK circulating issues from 1947 contain no silver. Value is numismatic only.",
    };
  }
  const purityLabel = purityDecimal === 0.925 ? "sterling 92.5%" : "50% silver";
  return {
    identifiedName: year ? `${year} ${name}` : name,
    purityDecimal,
    grossWeightGrams: grams,
    notes: `UK ${name} valued as ${purityLabel} using standard ${grams}g weight.`,
  };
}

function identifySilverLocally(description: string): SilverIdentity {
  const text = normalize(description);
  const year = extractYear(description);
  const sterling = /\bsterling\b|\b925\b/.test(text);

  if (/threepence|3d\b/.test(text)) return ukDenomination("Threepence", 1.41, year, sterling);
  if (/sixpence|6d\b/.test(text)) return ukDenomination("Sixpence", 2.83, year, sterling);
  if (/half[- ]?crown|halfcrown/.test(text)) return ukDenomination("Half Crown", 14.14, year, sterling);
  if (/\bflorin\b|\b2 shillings?\b/.test(text)) return ukDenomination("Florin", 11.31, year, sterling);
  if (/\bshillings?\b/.test(text)) return ukDenomination("Shilling", 5.65, year, sterling);
  if (/\bcrowns?\b/.test(text) && !/half/.test(text)) {
    return ukDenomination("Crown", 28.28, year, sterling);
  }
  if (/\bmorgan\b/.test(text)) {
    return {
      identifiedName: year ? `${year} Morgan Silver Dollar` : "Morgan Silver Dollar",
      purityDecimal: 0.9,
      grossWeightGrams: 26.73,
      notes: "US 90% silver dollar (26.73g).",
    };
  }
  if (/\bpeace\b/.test(text)) {
    return {
      identifiedName: year ? `${year} Peace Silver Dollar` : "Peace Silver Dollar",
      purityDecimal: 0.9,
      grossWeightGrams: 26.73,
      notes: "US 90% silver dollar (26.73g).",
    };
  }
  if (/walking liberty/.test(text)) {
    return {
      identifiedName: year ? `${year} Walking Liberty Half Dollar` : "Walking Liberty Half Dollar",
      purityDecimal: 0.9,
      grossWeightGrams: 12.5,
      notes: "US 90% silver half dollar.",
    };
  }
  if (/britannia/.test(text) && !/\bgold\b/.test(text)) {
    return {
      identifiedName: year ? `${year} Silver Britannia` : "1oz Silver Britannia",
      purityDecimal: 0.999,
      grossWeightGrams: TROY_OUNCE_GRAMS,
      notes: "Modern bullion Britannia assumed at .999 fine, 1 troy ounce.",
    };
  }
  if (/maple/.test(text) && !/\bgold\b/.test(text)) {
    return {
      identifiedName: year ? `${year} Silver Maple Leaf` : "1oz Silver Maple Leaf",
      purityDecimal: 0.9999,
      grossWeightGrams: TROY_OUNCE_GRAMS,
      notes: "Canadian Maple Leaf assumed at .9999 fine, 1 troy ounce.",
    };
  }
  if (/silver eagle|american silver eagle/.test(text)) {
    return {
      identifiedName: year ? `${year} American Silver Eagle` : "American Silver Eagle",
      purityDecimal: 0.999,
      grossWeightGrams: TROY_OUNCE_GRAMS,
      notes: "American Silver Eagle assumed at .999 fine, 1 troy ounce.",
    };
  }
  // 1995 Gibraltar VJ Day £5 — two issues: Virenium (base metal) and sterling silver proof.
  if (/gibraltar/.test(text) && (/vj\b|v\.?j\.?\s*day|victory over japan/.test(text) || /5[- ]?pound|£5|5\s*pounds?/.test(text))) {
    const wantsSilver =
      /\bsilver\b|\bsterling\b|\b925\b/.test(text) && !/\bvirenium\b/.test(text);
    if (wantsSilver) {
      return {
        identifiedName: "1995 Gibraltar VJ Day £5 (sterling silver proof)",
        purityDecimal: 0.925,
        grossWeightGrams: 23.5,
        notes:
          "Pobjoy Mint silver proof: 23.5g at 92.5% (about 21.74g fine silver). Separate from the Virenium base-metal issue.",
      };
    }
    return {
      identifiedName: "1995 Gibraltar VJ Day £5 (Virenium)",
      purityDecimal: 0,
      grossWeightGrams: 20.1,
      notes:
        "Pobjoy Mint Virenium issue (copper-nickel-zinc alloy, ~20.1g). No silver melt. If you have the sterling proof instead, describe it as silver.",
    };
  }
  if (/\bvirenium\b/.test(text)) {
    return {
      identifiedName: "Virenium commemorative (base metal)",
      purityDecimal: 0,
      grossWeightGrams: 0,
      notes:
        "Virenium is a Pobjoy Mint base-metal alloy, not silver. No silver melt value.",
    };
  }
  if (/\bsilver\b|\bsterling\b|\b925\b|\b999\b/.test(text)) {
    return {
      identifiedName: "Unspecified silver coin",
      purityDecimal: sterling ? 0.925 : 0.5,
      grossWeightGrams: 5,
      notes: "Could not match a known type. Conservative 5g estimate used until inspection.",
    };
  }

  return {
    identifiedName: "Unidentified coin — manual review",
    purityDecimal: 0,
    grossWeightGrams: 0,
    notes: "Could not safely infer silver content from the description.",
  };
}

function round(value: number, digits: number) {
  const factor = 10 ** digits;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Deterministic silver valuation used when Gemini is unavailable. */
export function evaluateSilverLocally(userInput: string, silverSpotGBP: number): EvaluatedCoin {
  const identity = identifySilverLocally(userInput);
  const purityDecimal = Math.min(1, Math.max(0, identity.purityDecimal));
  const grossWeightGrams = Math.max(0, identity.grossWeightGrams);
  const fineMetalGramsPerCoin = round(grossWeightGrams * purityDecimal, 6);
  const fineMetalOuncesPerCoin = round(fineMetalGramsPerCoin / TROY_OUNCE_GRAMS, 8);
  const rawMeltValuePerCoinGBP = round(fineMetalOuncesPerCoin * silverSpotGBP, 2);

  return {
    identifiedName: identity.identifiedName,
    metalType: purityDecimal > 0 ? "silver" : "none",
    purityDecimal,
    grossWeightGrams: round(grossWeightGrams, 4),
    fineMetalGramsPerCoin,
    fineMetalOuncesPerCoin,
    rawMeltValuePerCoinGBP,
    notes: identity.notes,
  };
}

export function finalizeEvaluatedCoin(
  partial: Pick<
    EvaluatedCoin,
    "identifiedName" | "purityDecimal" | "grossWeightGrams" | "notes"
  > &
    Partial<Pick<EvaluatedCoin, "metalType">>,
  silverSpotGBP: number,
): EvaluatedCoin {
  const purityDecimal = Math.min(1, Math.max(0, partial.purityDecimal));
  const grossWeightGrams = Math.max(0, partial.grossWeightGrams);
  const fineMetalGramsPerCoin = round(grossWeightGrams * purityDecimal, 6);
  const fineMetalOuncesPerCoin = round(fineMetalGramsPerCoin / TROY_OUNCE_GRAMS, 8);
  const rawMeltValuePerCoinGBP = round(fineMetalOuncesPerCoin * silverSpotGBP, 2);

  return {
    identifiedName: partial.identifiedName.trim() || "Unidentified silver coin",
    metalType: purityDecimal > 0 ? "silver" : "none",
    purityDecimal,
    grossWeightGrams: round(grossWeightGrams, 4),
    fineMetalGramsPerCoin,
    fineMetalOuncesPerCoin,
    rawMeltValuePerCoinGBP,
    notes: partial.notes.trim(),
  };
}
