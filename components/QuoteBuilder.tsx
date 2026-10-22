"use client";

import { useMemo, useState, type FormEvent } from "react";
import { formatGbp, formatNumber } from "@/lib/format";
import type { EvaluatedCoin } from "@/lib/silver-quote";

const OFFER_RATE = 0.8;

type Condition = "circulated" | "about-uncirculated" | "mint-state";
type Packaging = "loose" | "box" | "box-papers";

type QuoteLine = EvaluatedCoin & {
  id: string;
  description: string;
  quantity: number;
  condition: Condition;
  packaging: Packaging;
};

const CONDITIONS: Array<{ value: Condition; label: string; hint: string }> = [
  { value: "circulated", label: "Circulated", hint: "Everyday wear, readable detail" },
  {
    value: "about-uncirculated",
    label: "About Uncirculated",
    hint: "Light friction, most mint bloom intact",
  },
  {
    value: "mint-state",
    label: "Mint State / Proof",
    hint: "Uncirculated, cameo or gem surfaces",
  },
];

const PACKAGING: Array<{ value: Packaging; label: string; hint: string }> = [
  { value: "loose", label: "Loose Coin", hint: "No original box or papers" },
  { value: "box", label: "Box or Papers Only", hint: "Original case, no certificate" },
  {
    value: "box-papers",
    label: "Box & Papers / CoA",
    hint: "Original case with certificate of authenticity",
  },
];

const CONDITION_LABEL: Record<Condition, string> = {
  circulated: "Circulated",
  "about-uncirculated": "About Uncirculated",
  "mint-state": "Mint State / Proof",
};

const PACKAGING_LABEL: Record<Packaging, string> = {
  loose: "Loose Coin",
  box: "Box or Papers Only",
  "box-papers": "Box & Papers / CoA",
};

type QuoteBuilderProps = {
  goldSpotGBP?: number | null;
  silverSpotGBP?: number | null;
};

function newLineId() {
  return globalThis.crypto?.randomUUID?.() ?? `line-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function QuoteBuilder({
  goldSpotGBP = null,
  silverSpotGBP = null,
}: QuoteBuilderProps) {
  const goldGbp = goldSpotGBP && goldSpotGBP > 0 ? goldSpotGBP : null;
  const silverGbp = silverSpotGBP && silverSpotGBP > 0 ? silverSpotGBP : null;
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<Condition>("circulated");
  const [packaging, setPackaging] = useState<Packaging>("loose");
  const [lines, setLines] = useState<QuoteLine[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totals = useMemo(() => {
    const fullMelt = roundMoney(
      lines.reduce((sum, line) => sum + line.rawMeltValuePerCoinGBP * line.quantity, 0),
    );
    return {
      customerPayout: roundMoney(fullMelt * OFFER_RATE),
      totalCoins: lines.reduce((sum, line) => sum + line.quantity, 0),
    };
  }, [lines]);

  async function addCoin(event: FormEvent) {
    event.preventDefault();
    setError(null);

    const trimmed = description.trim();
    if (!trimmed) {
      setError("Enter a coin description first.");
      return;
    }
    if (!(silverGbp && silverGbp > 0)) {
      setError("Live silver spot is still loading. Please try again in a moment.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: trimmed,
          silverSpotGBP: silverGbp,
          ...(goldGbp ? { goldSpotGBP: goldGbp } : {}),
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error ?? "Quote request failed.");
      }

      const evaluated = payload as EvaluatedCoin;
      setLines((prev) => [
        ...prev,
        {
          ...evaluated,
          id: newLineId(),
          description: trimmed,
          quantity: Math.max(1, Math.min(999, Math.round(quantity) || 1)),
          condition,
          packaging,
        },
      ]);
      setDescription("");
      setQuantity(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Quote request failed.");
    } finally {
      setBusy(false);
    }
  }

  function updateQuantity(id: string, next: number) {
    const quantity = Math.max(1, Math.min(999, Math.round(next) || 1));
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, quantity } : line)));
  }

  function removeLine(id: string) {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }

  return (
    <div className="rounded-[2rem] border border-white/10 bg-card/80 p-6 shadow-xl shadow-black/20 sm:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Coin Quote Engine
          </p>
          <h2 className="mt-2 font-serif text-3xl text-white sm:text-4xl">
            Instant Coin Valuation
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
            Describe each coin based on your knowledge. Specify year, what it is and where it is
            from.
          </p>
        </div>
        <div className="grid min-w-[14rem] grid-cols-2 gap-3 sm:min-w-[18rem]">
          <div className="rounded-2xl border border-white/10 bg-navy/60 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Gold Spot
            </p>
            <p className="mt-1 font-semibold text-gold">
              {goldGbp ? `${formatGbp(goldGbp)}/oz` : "Loading…"}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-navy/60 px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Silver Spot
            </p>
            <p className="mt-1 font-semibold text-gold">
              {silverGbp ? `${formatGbp(silverGbp)}/oz` : "Loading…"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={addCoin} className="mt-8 space-y-6">
        <label className="block text-sm">
          <span className="mb-2 block font-medium text-slate-100">Coin Description</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder='e.g. "1946 British Silver Shilling" or "1921 Morgan Dollar"'
            className="w-full rounded-2xl border border-white/10 bg-navy/60 px-4 py-3 text-white outline-none ring-gold placeholder:text-slate-500 focus:ring-2"
          />
        </label>

        <label className="block max-w-xs text-sm">
          <span className="mb-2 block font-medium text-slate-100">Quantity</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="rounded-xl border border-white/10 px-3 py-2 text-white hover:border-gold/40"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={999}
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
              className="w-full rounded-2xl border border-white/10 bg-navy/60 px-4 py-3 text-center text-white outline-none ring-gold focus:ring-2"
            />
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(999, q + 1))}
              className="rounded-xl border border-white/10 px-3 py-2 text-white hover:border-gold/40"
            >
              +
            </button>
          </div>
        </label>

        <ChoiceGroup
          legend="Condition Modifier"
          name="quote-condition"
          value={condition}
          options={CONDITIONS}
          onChange={setCondition}
        />
        <ChoiceGroup
          legend="Packaging Bonus"
          name="quote-packaging"
          value={packaging}
          options={PACKAGING}
          onChange={setPackaging}
        />

        {error ? (
          <p className="rounded-2xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? "Evaluating…" : "[ + Add Coin to Quote ]"}
        </button>
      </form>

      <div className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-serif text-2xl text-white">Quote Line Items</h3>
          <p className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-medium text-amber-100">
            Total Items: {totals.totalCoins}
          </p>
        </div>

        {lines.length === 0 ? (
          <p className="mt-4 text-sm text-slate-400">
            No coins added yet. Enter a description and add your first line.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {lines.map((line) => {
              const linePayout = roundMoney(
                line.rawMeltValuePerCoinGBP * line.quantity * OFFER_RATE,
              );
              return (
                <li
                  key={line.id}
                  className="rounded-3xl border border-white/10 bg-navy/50 p-4 sm:p-5"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-white">{line.identifiedName}</p>
                      <p className="mt-1 text-xs text-slate-400">{line.description}</p>
                      <p className="mt-2 text-sm text-slate-300">
                        {CONDITION_LABEL[line.condition]} · {PACKAGING_LABEL[line.packaging]}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-slate-400">{line.notes}</p>
                      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                        <div>
                          <dt className="text-slate-500">Purity</dt>
                          <dd className="text-slate-200">{formatNumber(line.purityDecimal * 100, 1)}%</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">Weight</dt>
                          <dd className="text-slate-200">{formatNumber(line.grossWeightGrams, 2)}g</dd>
                        </div>
                        <div>
                          <dt className="text-slate-500">
                            Fine {line.metalType === "gold" ? "gold" : "metal"} / coin
                          </dt>
                          <dd className="text-slate-200">
                            {formatNumber(line.fineMetalOuncesPerCoin, 4)} oz
                          </dd>
                        </div>
                      </dl>
                    </div>

                    <div className="flex shrink-0 flex-col items-stretch gap-3 sm:items-end">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Decrease line quantity"
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          className="rounded-xl border border-white/10 px-3 py-2 text-white hover:border-gold/40"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min={1}
                          max={999}
                          value={line.quantity}
                          onChange={(event) =>
                            updateQuantity(line.id, Number(event.target.value) || 1)
                          }
                          className="w-16 rounded-xl border border-white/10 bg-navy px-2 py-2 text-center text-white outline-none ring-gold focus:ring-2"
                        />
                        <button
                          type="button"
                          aria-label="Increase line quantity"
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          className="rounded-xl border border-white/10 px-3 py-2 text-white hover:border-gold/40"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Estimated payout</p>
                        <p className="font-semibold text-gold">{formatGbp(linePayout)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeLine(line.id)}
                        className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-slate-200 hover:border-red-300/40 hover:text-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-8 rounded-3xl border border-gold/25 bg-gold/10 p-5">
        <p className="text-xs uppercase tracking-wide text-amber-100/80">Estimated Payout</p>
        <p className="mt-1 font-serif text-3xl text-gold">{formatGbp(totals.customerPayout)}</p>
      </div>
    </div>
  );
}

function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  options,
  onChange,
}: {
  legend: string;
  name: string;
  value: T;
  options: Array<{ value: T; label: string; hint: string }>;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-slate-100">{legend}</legend>
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded-2xl border p-4 ${
              value === option.value ? "border-gold bg-gold/10" : "border-white/10 bg-navy/40"
            }`}
          >
            <input
              type="radio"
              name={name}
              className="sr-only"
              checked={value === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="block font-medium text-white">{option.label}</span>
            <span className="mt-1 block text-xs leading-5 text-slate-300">{option.hint}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
