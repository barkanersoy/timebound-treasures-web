import { BrandLogo } from "@/components/BrandLogo";
import { SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-navy-deep">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-3">
          <BrandLogo size={40} />
          <div>
            <p className="font-serif text-white">{SITE.name}</p>
            <p className="text-xs text-muted">
              {SITE.owners} · {SITE.location}
            </p>
          </div>
        </div>
        <p className="max-w-md text-xs leading-5 text-slate-400">
          Indicative quotes are linked to live gold and silver spot prices. Final payouts
          follow physical inspection. © {new Date().getFullYear()} {SITE.name}.
        </p>
      </div>
    </footer>
  );
}
