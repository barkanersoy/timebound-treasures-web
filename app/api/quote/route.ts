import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import {
  EvaluatedCoinSchema,
  QuoteRequestSchema,
  TROY_OUNCE_GRAMS,
  evaluateCoinLocally,
  evaluateGoldLocally,
  finalizeEvaluatedCoin,
  type EvaluatedCoin,
} from "@/lib/silver-quote";

const QUOTE_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash",
  "gemini-flash-latest",
] as const;

const SYSTEM_PROMPT = `You are a UK coin valuation assistant for Timebound Treasures (gold and silver melt).
Identify the coin from the customer's description and return structured fields only.

You have Google Search. For any coin that is not a standard circulating UK/US type,
SEARCH the web for official mint specs (metal, fineness, weight) before answering.
Prefer Royal Mint, Pobjoy Mint, NGC, PCGS, or reputable dealer datasheets.

Hard rules (obey exactly):
- 1 Troy Ounce = ${TROY_OUNCE_GRAMS} grams.
- UK full Sovereign = 7.988g at 0.9167 (22ct gold). Half = 3.994g. Quarter = 1.997g.
- Krugerrand 1oz = 33.93g at 0.9167. Gold Britannia / Maple 1oz ≈ ${TROY_OUNCE_GRAMS}g at 0.9999.
- UK silver purity by date:
  • Pre-1920 = 0.925 (sterling)
  • 1920–1946 inclusive = 0.50
  • 1947 and later circulating = 0 (cupro-nickel; metalType "none")
- If no year is given for a circulating UK denomination, assume pre-1947 50% silver unless the text clearly says sterling/925 or Victorian/Edwardian (then 0.925).
- Standard UK silver weights (gross):
  • Threepence = 1.41g
  • Sixpence = 2.83g
  • Shilling = 5.65g
  • Florin (2 shillings) = 11.31g
  • Half Crown = 14.14g
  • Crown = 28.28g
- For modern 1oz silver bullion (Britannia, Maple, Eagle, etc.) use ${TROY_OUNCE_GRAMS}g at the stated fineness (usually 0.999 or 0.9999).
- US 90% silver: Morgan/Peace dollar = 26.73g at 0.900; Walking Liberty half = 12.50g at 0.900.
- Virenium, cupro-nickel, brass, and other non-precious mint alloys have purityDecimal 0 and metalType "none".
- If a commemorative exists in both base-metal and silver proof versions, match the customer's metal wording. "Virenium" is not silver.
- metalType must be "gold", "silver", or "none".
- fineMetalGramsPerCoin = grossWeightGrams × purityDecimal
- fineMetalOuncesPerCoin = fineMetalGramsPerCoin / ${TROY_OUNCE_GRAMS}
- rawMeltValuePerCoinGBP = fineMetalOuncesPerCoin × the matching metal spot in GBP (gold spot for gold, silver spot for silver)
- Prefer conservative identification when uncertain; explain uncertainty and cite the source in notes.
- Do not invent numismatic premiums in the melt fields — melt only.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = QuoteRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          error:
            "Invalid request. Provide userInput (string), silverSpotGBP (number), and optionally goldSpotGBP.",
        },
        { status: 400 },
      );
    }

    const { userInput, silverSpotGBP, goldSpotGBP } = parsed.data;

    // Known gold types (sovereign, Krugerrand, etc.) — never send through silver-only fallback.
    if (goldSpotGBP && goldSpotGBP > 0) {
      const gold = evaluateGoldLocally(userInput, goldSpotGBP);
      if (gold) {
        return NextResponse.json(gold);
      }
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        evaluateCoinLocally(userInput, { goldSpotGBP, silverSpotGBP }),
      );
    }

    const prompt = `Gold spot price: £${(goldSpotGBP ?? 0).toFixed(4)} per troy ounce.
Silver spot price: £${silverSpotGBP.toFixed(4)} per troy ounce.

Customer description:
${userInput.trim()}

Search if needed, then return the evaluated coin object. Recalculate fine metal and melt using the matching spot above.`;

    try {
      const object = await generateWithSearch(prompt);
      const spotForMetal =
        object.metalType === "gold" && goldSpotGBP && goldSpotGBP > 0
          ? goldSpotGBP
          : silverSpotGBP;
      return NextResponse.json(
        finalizeEvaluatedCoin(
          {
            identifiedName: object.identifiedName,
            metalType: object.metalType,
            purityDecimal: object.purityDecimal,
            grossWeightGrams: object.grossWeightGrams,
            notes: object.notes,
          },
          spotForMetal,
        ),
      );
    } catch (aiError) {
      console.warn("[api/quote] AI unavailable, using local coin rules", aiError);
      return NextResponse.json(
        evaluateCoinLocally(userInput, { goldSpotGBP, silverSpotGBP }),
      );
    }
  } catch (error) {
    console.error("[api/quote]", error);
    return NextResponse.json(
      { error: "Unable to evaluate that coin right now. Please try again." },
      { status: 502 },
    );
  }
}

async function generateWithSearch(prompt: string): Promise<EvaluatedCoin> {
  let lastError: unknown;

  for (const modelId of QUOTE_MODELS) {
    try {
      const result = await generateText({
        model: google(modelId),
        tools: {
          google_search: google.tools.googleSearch({}),
        },
        output: Output.object({
          schema: EvaluatedCoinSchema,
          name: "EvaluatedCoin",
          description: "Coin identification and melt valuation fields",
        }),
        system: SYSTEM_PROMPT,
        prompt,
        temperature: 0.2,
        maxRetries: 0,
      });

      if (!result.output) {
        throw new Error(`No structured output from ${modelId}`);
      }

      return result.output;
    } catch (error) {
      lastError = error;
      if (!isTransientModelError(error)) {
        throw error;
      }
      console.warn(`[api/quote] ${modelId} unavailable, trying next model`);
    }
  }

  throw lastError;
}

function isTransientModelError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const statusCode = "statusCode" in error ? Number(error.statusCode) : NaN;
  const message =
    "message" in error && typeof error.message === "string" ? error.message.toLowerCase() : "";
  return (
    statusCode === 404 ||
    statusCode === 429 ||
    statusCode === 503 ||
    message.includes("high demand") ||
    message.includes("unavailable") ||
    message.includes("no longer available") ||
    message.includes("not found") ||
    message.includes("quota") ||
    message.includes("resource_exhausted") ||
    message.includes("rate limit")
  );
}
