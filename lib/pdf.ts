import { jsPDF } from "jspdf";
import { SITE } from "@/lib/site";
import { formatGbp, formatNumber, percentLabel } from "@/lib/format";
import {
  CONDITION_LABEL,
  PACKAGING_LABEL,
  type CollectionValuation,
  type SpotPrices,
} from "@/lib/valuation";

function paintPage(doc: jsPDF) {
  doc.setFillColor(252, 248, 240);
  doc.rect(0, 0, 210, 297, "F");
}

function room(doc: jsPDF, y: number, needed: number) {
  if (y + needed <= 280) return y;
  doc.addPage();
  paintPage(doc);
  return 18;
}

export async function generateOfferPdf(input: {
  customerName: string;
  customerEmail: string;
  collection: CollectionValuation;
  spot: SpotPrices;
}): Promise<void> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const { collection, spot } = input;
  paintPage(doc);

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, 210, 46, "F");
  doc.setTextColor(245, 158, 11);
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.text(SITE.name, 16, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(226, 232, 240);
  doc.text(`${SITE.owners} · ${SITE.location}`, 16, 28);
  doc.text("Itemised purchase offer", 16, 36);

  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Prepared for", 16, 60);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(input.customerName, 16, 67);
  doc.text(input.customerEmail, 16, 73);

  doc.setFont("helvetica", "bold");
  doc.text("Collection", 110, 60);
  doc.setFont("helvetica", "normal");
  doc.text(`${collection.totalCoins} coin${collection.totalCoins === 1 ? "" : "s"}`, 110, 67);
  doc.text(`${collection.lines.length} line${collection.lines.length === 1 ? "" : "s"}`, 110, 73);

  let y = 88;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Itemised receipt", 16, y);
  y += 8;

  collection.lines.forEach((line, index) => {
    const title = doc.splitTextToSize(
      `${index + 1}. ${line.quantity}× ${line.description}`,
      170,
    );
    const detail = doc.splitTextToSize(
      `${line.identified.name} · ${CONDITION_LABEL[line.condition]} · ${PACKAGING_LABEL[line.packaging]} · ${line.photoCount} photo${line.photoCount === 1 ? "" : "s"}`,
      170,
    );
    const block = 22 + title.length * 5 + detail.length * 4.5;
    y = room(doc, y, block);

    doc.setFillColor(30, 41, 59);
    doc.roundedRect(14, y, 182, block - 4, 2, 2, "F");
    doc.setTextColor(248, 250, 252);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(title, 20, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(detail, 20, y + 7 + title.length * 5);
    const figuresY = y + 8 + title.length * 5 + detail.length * 4.5;
    doc.setTextColor(245, 158, 11);
    doc.text(
      `Melt each ${formatGbp(line.meltValue)} · Offer each ${formatGbp(line.offerPerCoin)} · Line ${formatGbp(line.offerTotal)}`,
      20,
      figuresY,
    );
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(8);
    doc.text(
      `${formatNumber(line.identified.weightGrams, 3)} g · ${percentLabel(line.identified.purity)} fine · ${percentLabel(line.offerRate)} of melt`,
      20,
      figuresY + 5,
    );
    y += block;
  });

  y = room(doc, y, 22);
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, y, 182, 16, 2, 2, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(248, 250, 252);
  doc.text("Grand Total Estimated Payout", 20, y + 10);
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(14);
  doc.text(formatGbp(collection.grandTotal), 190, y + 10, { align: "right" });
  y += 24;

  const notes = collection.lines.filter((line) => line.isHighValueCollectible);
  if (notes.length > 0) {
    const copy = notes
      .map(
        (line) =>
          `${line.quantity}× ${line.description}: ${line.highValueReason ?? "May be worth more than melt. Expect a follow-up after photo review."}`,
      )
      .join(" ");
    const wrapped = doc.splitTextToSize(copy, 170);
    const height = 16 + wrapped.length * 4.5;
    y = room(doc, y, height);
    doc.setFillColor(254, 243, 199);
    doc.roundedRect(14, y, 182, height, 2, 2, "F");
    doc.setTextColor(120, 53, 15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Pieces that need a private appraisal", 20, y + 8);
    doc.setFont("helvetica", "normal");
    doc.text(wrapped, 20, y + 14);
    y += height + 6;
  }

  y = room(doc, y, 28);
  doc.setTextColor(71, 85, 105);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const disclaimer = doc.splitTextToSize(
    "This PDF is an automated estimate linked to live gold and silver spot prices at generation time. It is not a binding contract. Official offers are confirmed after physical verification. Spot source: " +
      `${spot.source === "live" ? "live" : "cached"} gold ${formatGbp(spot.goldGbp)}/oz, silver ${formatGbp(spot.silverGbp)}/oz at ${new Date(spot.updatedAt).toLocaleString("en-GB")}. Payment by direct bank transfer, PayPal, or cash at our West London office.`,
    182,
  );
  doc.text(disclaimer, 14, y);
  doc.text(SITE.email, 14, 286);

  const stamp = new Date().toISOString().slice(0, 10);
  doc.save(`Timebound-Treasures-Offer-${stamp}.pdf`);
}
