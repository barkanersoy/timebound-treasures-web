"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FRAMES = [
  {
    src: "/hero-story/1-drawer.jpg",
    caption: "Forgotten coins, waiting in a drawer",
    tone: "mono" as const,
  },
  {
    src: "/hero-story/2-parcel.jpg",
    caption: "Parcel collection arranged by Timebound Treasures or Visit In Person",
    tone: "mono" as const,
  },
  {
    src: "/hero-story/3-arrival.jpg",
    caption: "Arrives at Timebound Treasures, London",
    tone: "color" as const,
  },
  {
    src: "/hero-story/4-cash.jpg",
    caption: "Verified. Paid. Instant cash back to you",
    tone: "color" as const,
  },
] as const;

const FRAME_MS = 3200;

export function HeroStoryReel() {
  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % FRAMES.length);
    }, FRAME_MS);
    return () => window.clearInterval(id);
  }, [tick]);

  function go(delta: number) {
    setIndex((current) => (current + delta + FRAMES.length) % FRAMES.length);
    setTick((value) => value + 1);
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-gold/20 shadow-2xl shadow-black/40">
      <div className="relative aspect-[4/3] bg-navy-deep">
        {FRAMES.map((frame, frameIndex) => {
          const active = frameIndex === index;
          return (
            <div
              key={frame.src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
                active ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!active}
            >
              <Image
                src={frame.src}
                alt=""
                fill
                priority={frameIndex === 0}
                sizes="(min-width: 1024px) 40vw, 90vw"
                className={`object-cover transition-[filter] duration-1000 ${
                  frame.tone === "mono" ? "grayscale contrast-125" : "grayscale-0"
                }`}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-transparent to-transparent" />
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous story frame"
          className="absolute left-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-navy/35 text-white/70 backdrop-blur-sm transition hover:border-gold/40 hover:bg-navy/55 hover:text-gold sm:left-3 sm:h-10 sm:w-10"
        >
          <Chevron direction="left" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next story frame"
          className="absolute right-2 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-navy/35 text-white/70 backdrop-blur-sm transition hover:border-gold/40 hover:bg-navy/55 hover:text-gold sm:right-3 sm:h-10 sm:w-10"
        >
          <Chevron direction="right" />
        </button>

        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            From drawer to payout
          </p>
          <p className="mt-1 font-serif text-lg leading-snug text-white sm:text-xl">
            {FRAMES[index].caption}
          </p>
          <div className="mt-3 flex gap-1.5" aria-hidden>
            {FRAMES.map((frame, frameIndex) => (
              <span
                key={frame.src}
                className={`h-1 flex-1 rounded-full transition-colors duration-500 ${
                  frameIndex === index ? "bg-gold" : "bg-white/25"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">
        Animated story: coins stored in a dusty drawer, shipped to Timebound Treasures, then paid
        out as instant cash.
      </span>
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="h-4 w-4"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "left" ? (
        <path d="M12.5 4.5 7 10l5.5 5.5" />
      ) : (
        <path d="M7.5 4.5 13 10l-5.5 5.5" />
      )}
    </svg>
  );
}
