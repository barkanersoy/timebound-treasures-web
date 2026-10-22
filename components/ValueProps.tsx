const CARDS = [
  {
    title: "Fair Market Valuations",
    body: "Real-time spot rate tracking with minimal dealer margins—letting you keep maximum value without giving away up to 35% in traditional auction house fees.",
  },
  {
    title: "Rapid Payment Processing",
    body: "Funds are transferred via Direct Bank Transfer or PayPal within 15 minutes of receiving and physically verifying your items.",
  },
  {
    title: "Insured Home Collection & Post",
    body: "Enjoy effortless, fully insured postal collection arranged directly from your doorstep, or use our prepaid tracked mail options.",
  },
  {
    title: "Bespoke Consultations",
    body: "For substantial estates or rare, complex collections requiring specialist appraisal, we offer private in-person appointments at our West London office upon invitation.",
  },
];

export function ValueProps() {
  return (
    <section className="border-b border-white/10 bg-navy-deep/40" aria-labelledby="why-heading">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Why sell to us?</p>
        <h2 id="why-heading" className="mt-2 max-w-2xl font-serif text-3xl leading-tight text-white sm:text-4xl">
          A Fair, Transparent Way To Sell Your Collection
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
          We eliminate retail markup and auction house fees by running a lean, independent
          service focused on market-accurate valuations and prompt payouts.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {CARDS.map((card, index) => (
            <article
              key={card.title}
              className="rounded-3xl border border-white/10 bg-card p-6 shadow-lg shadow-black/20"
            >
              <p className="text-xs font-semibold tracking-[0.16em] text-gold">0{index + 1}</p>
              <h3 className="mt-3 font-serif text-xl text-white sm:text-2xl">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-200">{card.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
