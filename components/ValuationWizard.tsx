"use client";

import { useMemo, useState } from "react";
import { SITE } from "@/lib/site";
import { formatGbp, formatNumber, percentLabel } from "@/lib/format";
import { generateOfferPdf } from "@/lib/pdf";
import {
  CONDITION_LABEL,
  PACKAGING_LABEL,
  valueCollection,
  type CoinItem,
  type Condition,
  type Packaging,
  type SpotPrices,
} from "@/lib/valuation";

const STEPS = [
  "1. Item Details",
  "2. Market Valuation",
  "3. Your Estimated Payout",
  "4. Official Quote & PDF",
] as const;

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
  { value: "box", label: "Box Only", hint: "Original case, no certificate" },
  {
    value: "box-papers",
    label: "Box & Papers / CoA",
    hint: "Original case with certificate of authenticity",
  },
];

type ValuationWizardProps = {
  spot: SpotPrices | null;
};

function newItemId() {
  return globalThis.crypto?.randomUUID?.() ?? `coin-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function ValuationWizard({ spot }: ValuationWizardProps) {
  const [step, setStep] = useState(0);
  const [items, setItems] = useState<CoinItem[]>([]);
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [files, setFiles] = useState<File[]>([]);
  const [fileKey, setFileKey] = useState(0);
  const [condition, setCondition] = useState<Condition>("circulated");
  const [packaging, setPackaging] = useState<Packaging>("loose");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalCoins = items.reduce((sum, item) => sum + item.quantity, 0);
  const collection = useMemo(
    () => (spot && items.length > 0 ? valueCollection(items, spot) : null),
    [items, spot],
  );

  function addFiles(list: FileList | File[]) {
    const incoming = Array.from(list).filter((file) => file.type.startsWith("image/"));
    setFiles((current) => [...current, ...incoming].slice(0, 8));
  }

  function canAddDraft() {
    return description.trim().length > 3;
  }

  function addCoin() {
    if (!canAddDraft()) return;
    setItems((current) => [
      ...current,
      {
        id: newItemId(),
        description: description.trim(),
        quantity,
        condition,
        packaging,
        photoCount: files.length,
      },
    ]);
    setDescription("");
    setQuantity(1);
    setFiles([]);
    setFileKey((value) => value + 1);
    setCondition("circulated");
    setPackaging("loose");
  }

  function removeCoin(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function canAdvance() {
    if (step === 0) return items.length > 0;
    if (step === 3) return name.trim().length > 1 && /.+@.+\..+/.test(email);
    return true;
  }

  async function submitQuote() {
    if (!collection || !spot) return;
    setBusy(true);
    setError(null);
    try {
      await generateOfferPdf({
        customerName: name.trim(),
        customerEmail: email.trim(),
        collection,
        spot,
      });
      const subject = encodeURIComponent("Coin collection offer request");
      const body = encodeURIComponent(
        [
          "Hello Barkan & Tamer,",
          "",
          `${name} would like to sell:`,
          ...collection.lines.map(
            (line) => `${line.quantity}× ${line.description} — ${formatGbp(line.offerTotal)}`,
          ),
          "",
          `Grand Total Estimated Payout: ${formatGbp(collection.grandTotal)}.`,
          "A PDF offer has been generated on the website.",
          "",
          `Email: ${email}`,
        ].join("\n"),
      );
      window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
      setDone(true);
    } catch {
      setError("The PDF could not be generated. Please try again or email us directly.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <h2 className="font-serif text-3xl text-white">Instant Coin Valuation Estimator</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
        Receive an immediate, market-accurate valuation in four simple steps based on live
        bullion rates. Official offers are guaranteed upon physical verification.
      </p>
      <p className="mt-4 inline-flex rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
        Total Items in Appraisal: {totalCoins} {totalCoins === 1 ? "coin" : "coins"}
      </p>

      <ol className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4" aria-label="Valuation steps">
        {STEPS.map((label, index) => (
          <li key={label} className="min-w-0">
            <button
              type="button"
              onClick={() => {
                if (index <= step) setStep(index);
              }}
              className={`w-full rounded-full px-3 py-2.5 text-center text-xs font-semibold leading-snug ${
                index === step
                  ? "bg-gold text-navy"
                  : index < step
                    ? "bg-gold/20 text-amber-200"
                    : "bg-white/5 text-slate-200"
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-8 rounded-3xl border border-white/10 bg-card p-5 sm:p-8">
        {step === 0 ? (
          <div className="space-y-6">
            <h3 className="font-serif text-2xl text-white">Item Details</h3>
            <label className="block text-sm">
              <span className="mb-2 block font-medium text-slate-100">Coin Description or Name</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder='e.g., "1946 British Silver Shilling" or "1/10 oz Gold Britannia"'
                className="w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white outline-none ring-gold placeholder:text-slate-500 focus:ring-2"
              />
            </label>
            <div>
              <p className="mb-2 text-sm font-medium text-slate-100">Quantity</p>
              <div className="inline-flex items-center rounded-full border border-white/10">
                <button
                  type="button"
                  className="h-11 w-11 text-lg text-gold"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-10 text-center font-semibold">{quantity}</span>
                <button
                  type="button"
                  className="h-11 w-11 text-lg text-gold"
                  onClick={() => setQuantity((value) => Math.min(999, value + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
            <ChoiceGroup
              legend="Condition"
              name="draft-condition"
              value={condition}
              options={CONDITIONS}
              onChange={setCondition}
            />
            <ChoiceGroup
              legend="Packaging"
              name="draft-packaging"
              value={packaging}
              options={PACKAGING}
              onChange={setPackaging}
            />
            <div
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                addFiles(event.dataTransfer.files);
              }}
              className="rounded-2xl border border-dashed border-gold/40 bg-navy/60 px-4 py-8 text-center"
            >
              <p className="text-sm text-slate-100">Drag and drop coin photographs here, or</p>
              <label className="mt-3 inline-flex cursor-pointer rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy">
                Browse Files
                <input
                  key={fileKey}
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    if (event.target.files) addFiles(event.target.files);
                  }}
                />
              </label>
              {files.length > 0 ? (
                <ul className="mt-4 flex flex-wrap justify-center gap-2">
                  {files.map((file) => (
                    <li
                      key={`${file.name}-${file.lastModified}`}
                      className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200"
                    >
                      {file.name}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="mt-3 text-xs leading-5 text-slate-300">
                Optional — upload up to 8 clear images for higher appraisal accuracy.
              </p>
            </div>
            <button
              type="button"
              onClick={addCoin}
              disabled={!canAddDraft()}
              className="inline-flex w-full items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-semibold text-navy hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              {items.length === 0 ? "[ + Add Coin to List ]" : "[ + Add Another Coin Type ]"}
            </button>
            <ItemList items={items} onRemove={removeCoin} />
            {items.length === 0 ? (
              <p className="text-sm text-slate-400">
                Add at least one coin type before continuing. You can mix several types in one request.
              </p>
            ) : null}
          </div>
        ) : null}

        {step === 1 && collection && spot ? (
          <div className="space-y-4">
            <h3 className="font-serif text-2xl text-white">Market Valuation</h3>
            <p className="text-sm text-slate-300">
              Gold {formatGbp(spot.goldGbp)}/oz · Silver {formatGbp(spot.silverGbp)}/oz
              {spot.source === "live" ? " · live" : " · cached fallback"}
            </p>
            <ul className="space-y-3">
              {collection.lines.map((line) => (
                <li key={line.itemId} className="rounded-2xl border border-white/10 bg-navy/50 p-4">
                  <p className="font-medium text-white">
                    {line.quantity}× {line.description}
                  </p>
                  <p className="mt-1 text-sm text-slate-300">{line.identified.name}</p>
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <Fact label="Gross Weight" value={`${formatNumber(line.identified.weightGrams, 3)} g`} />
                    <Fact label="Purity" value={percentLabel(line.identified.purity)} />
                    <Fact label="Fine Metal" value={`${formatNumber(line.fineTroyOz, 4)} oz`} />
                    <Fact label="Melt Each" value={formatGbp(line.meltValue)} />
                    <Fact label="You Keep" value={percentLabel(line.offerRate)} />
                    <Fact label="Line Total" value={formatGbp(line.offerTotal)} />
                  </dl>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {step === 1 && !collection ? (
          <p className="text-sm text-slate-300">Live rates are still loading. Add coins, then return to this step.</p>
        ) : null}

        {step === 2 && collection ? (
          <div>
            <h3 className="font-serif text-2xl text-white">Your Estimated Payout</h3>
            <div className="mt-6 hidden overflow-hidden rounded-2xl border border-white/10 sm:block">
              <table className="w-full text-left text-sm">
                <thead className="bg-navy/70 text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Coin</th>
                    <th className="px-4 py-3 font-medium">Grade</th>
                    <th className="px-4 py-3 text-right font-medium">Offer</th>
                  </tr>
                </thead>
                <tbody>
                  {collection.lines.map((line) => (
                    <tr key={line.itemId} className="border-t border-white/10">
                      <td className="px-4 py-3 text-white">
                        {line.quantity}× {line.description}
                      </td>
                      <td className="px-4 py-3 text-slate-300">
                        {CONDITION_LABEL[line.condition]}
                        <span className="block text-xs text-slate-400">{PACKAGING_LABEL[line.packaging]}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gold">
                        {formatGbp(line.offerTotal)}
                        <span className="block text-xs font-normal text-slate-400">
                          {formatGbp(line.offerPerCoin)} each
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="mt-6 space-y-3 sm:hidden">
              {collection.lines.map((line) => (
                <li key={line.itemId} className="rounded-2xl border border-white/10 bg-navy/50 p-4">
                  <p className="font-medium text-white">
                    {line.quantity}× {line.description}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {CONDITION_LABEL[line.condition]} · {PACKAGING_LABEL[line.packaging]}
                  </p>
                  <p className="mt-2 text-lg font-semibold text-gold">{formatGbp(line.offerTotal)}</p>
                  <p className="text-xs text-slate-400">{formatGbp(line.offerPerCoin)} each</p>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-1 rounded-2xl border border-gold/30 bg-gold/10 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-serif text-lg text-white">Grand Total Estimated Payout</p>
              <p className="font-serif text-2xl text-gold">{formatGbp(collection.grandTotal)}</p>
            </div>
            {collection.hasHighValue ? (
              <p className="mt-4 text-sm leading-6 text-amber-100">
                One or more pieces may be worth more than melt. The PDF flags them for a private appraisal.
              </p>
            ) : null}
          </div>
        ) : null}

        {step === 3 ? (
          <fieldset className="space-y-5">
            <legend className="font-serif text-2xl text-white">Official Quote & PDF</legend>
            <p className="text-sm leading-6 text-slate-300">
              The PDF is an itemised receipt for every coin in this appraisal
              {collection ? `, totalling ${formatGbp(collection.grandTotal)}` : ""}.
            </p>
            <label className="block text-sm">
              <span className="mb-2 block font-medium text-slate-100">Your Name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white outline-none ring-gold focus:ring-2"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block font-medium text-slate-100">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="w-full rounded-2xl border border-white/10 bg-navy px-4 py-3 text-white outline-none ring-gold focus:ring-2"
              />
            </label>
            <p className="rounded-2xl border border-white/10 bg-navy/60 px-4 py-3 text-sm text-slate-300">
              Official offers are confirmed after physical verification, either by insured post or at our West London office.
            </p>
            {error ? <p className="text-sm text-red-300">{error}</p> : null}
            {done ? (
              <p role="status" className="text-sm text-emerald-300">
                PDF downloaded. An email draft to {SITE.email} should now be open.
              </p>
            ) : null}
            <button
              type="button"
              disabled={!canAdvance() || busy || !collection}
              onClick={submitQuote}
              className="w-full rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy hover:bg-gold-dark disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
            >
              {busy ? "Preparing Offer…" : "Generate PDF Offer"}
            </button>
          </fieldset>
        ) : null}

        <div className="mt-8 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(0, value - 1))}
            disabled={step === 0}
            className="rounded-full border border-white/25 bg-white/10 px-5 py-2 text-sm font-semibold text-white hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((value) => Math.min(3, value + 1))}
              disabled={!canAdvance() || !spot}
              className="rounded-full bg-gold px-5 py-2 text-sm font-semibold text-navy hover:bg-gold-dark disabled:opacity-40"
            >
              Continue
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function ItemList({ items, onRemove }: { items: CoinItem[]; onRemove: (id: string) => void }) {
  if (items.length === 0) return null;
  return (
    <ul className="space-y-3" aria-label="Coins in this appraisal">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-navy/50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="font-medium text-white">
              {item.quantity}× {item.description}
            </p>
            <p className="mt-1 text-xs text-slate-300">
              {CONDITION_LABEL[item.condition]} · {PACKAGING_LABEL[item.packaging]}
            </p>
            <p className="mt-2 inline-flex rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-amber-100">
              {item.photoCount > 0
                ? `${item.photoCount} photo${item.photoCount === 1 ? "" : "s"}`
                : "No photos"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="inline-flex w-full items-center justify-center gap-1.5 self-start rounded-full border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:border-red-300/50 hover:text-red-200 sm:w-auto"
          >
            <TrashIcon />
            Remove
          </button>
        </li>
      ))}
    </ul>
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

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-slate-400">{label}</dt>
      <dd className="text-white">{value}</dd>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M9 7V5h6v2m-8 0 1 12h8l1-12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
