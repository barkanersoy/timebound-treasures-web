type BrandLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ size = 48, className = "", priority = false }: BrandLogoProps) {
  // Native <img> avoids Next Image downscale softening on small circular marks.
  // Source is a tight square crest served at full resolution for crisp retina rendering.
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-full border border-gold/40 bg-navy-deep shadow-[0_0_0_2px_rgba(245,158,11,0.15)] ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-crest.jpg"
        alt="Timebound Treasures crest"
        width={size}
        height={size}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        className="h-full w-full object-cover"
        style={{ imageRendering: "auto" }}
      />
    </span>
  );
}
