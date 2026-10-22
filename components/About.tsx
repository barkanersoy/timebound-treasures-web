import Image from "next/image";

const PEOPLE = [
  {
    name: "Barkan",
    role: "Numismatic Specialist · Sales, Marketplaces & Consignments",
    image: "/barkan.jpg",
    copy: "Focuses on global marketplace liquidity, consignment management, and sales strategy across major numismatic platforms. Barkan manages client consignments on a clear commission basis, leveraging historical pricing data to maximize realization values without the hassle of managing individual listings.",
  },
  {
    name: "Tamer",
    role: "Numismatic Specialist · Valuation, Purchasing & Grading",
    image: "/tamer.jpg",
    copy: "Specialises in physical coin appraisal, metal purity verification, and direct acquisitions. Tamer evaluates British and American coinage against live bullion spot rates and numismatic market demand, providing clear, transparent buyout offers and instant payouts.",
  },
] as const;

const ROUTES = [
  {
    title: "Outright Direct Purchase",
    body: "Receive an immediate cash offer based on live spot rates, paid instantly via Bank Transfer or PayPal upon item verification.",
  },
  {
    title: "Commission-Based Consignment",
    body: "For rare or premium collections where you wish to capture maximum retail value, we manage the full photography, listing, and marketplace execution for a transparent commission fee—backed by proven sales track records.",
  },
] as const;

export function About() {
  return (
    <section id="about" className="border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
          About Timebound Treasures
        </p>
        <h2 className="mt-2 max-w-2xl font-serif text-3xl text-white sm:text-4xl">
          Independent Coin Dealers / Specialists in London
        </h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
          Timebound Treasures is an independent numismatic practice founded by Barkan and
          Tamer. We simplify buying, selling, and appraising gold, silver, and rare
          collectible coinage. By operating through major public marketplaces, direct private
          trades, and commission-based consignments, we remove the friction, hidden fees, and
          market risk for collectors and estate sellers.
        </p>

        <div className="mt-12 space-y-12">
          {PEOPLE.map((person, index) => (
            <article
              key={person.name}
              className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8"
            >
              <Image
                src={person.image}
                alt={`Portrait of ${person.name}`}
                width={400}
                height={400}
                sizes="400px"
                className={`shrink-0 rounded-2xl grayscale contrast-125 ${
                  index === 1 ? "sm:order-2" : ""
                }`}
                style={{ width: "min(100%, 400px)", height: "auto" }}
              />
              <div className={index === 1 ? "sm:order-1" : ""}>
                <h3 className="font-serif text-3xl text-white">{person.name}</h3>
                <p className="mt-1 text-sm text-gold">{person.role}</p>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 sm:text-base">
                  {person.copy}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {ROUTES.map((route) => (
            <article
              key={route.title}
              className="rounded-3xl border border-white/10 bg-card p-6 shadow-lg shadow-black/20"
            >
              <h3 className="font-serif text-xl text-white sm:text-2xl">{route.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-200">{route.body}</p>
            </article>
          ))}
        </div>

        <p className="mt-6 text-sm leading-7 text-slate-400">
          For substantial estates or complex high-value collections, private in-person
          appraisals at our West London office are available strictly by appointment.
        </p>
      </div>
    </section>
  );
}
