import Image from "next/image";

type BrandLogoProps = {
  size?: number;
  className?: string;
  priority?: boolean;
};

export function BrandLogo({ size = 44, className = "", priority = false }: BrandLogoProps) {
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-full border border-gold/40 bg-navy-deep shadow-[0_0_0_2px_rgba(245,158,11,0.15)] ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.jpg"
        alt="Timebound Treasures crest"
        width={size}
        height={size}
        className="h-full w-full object-cover"
        priority={priority}
      />
    </span>
  );
}
