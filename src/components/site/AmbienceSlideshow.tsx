"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

const IMAGES = Array.from({ length: 8 }, (_, i) => `/ambience/ambience-${i + 1}.png`);
const INTERVAL = 4500;

export function AmbienceSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((i: number) => setIndex((i + IMAGES.length) % IMAGES.length), []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((p) => (p + 1) % IMAGES.length), INTERVAL);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-cloud shadow-lift sm:aspect-[16/10] lg:aspect-[16/9]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {IMAGES.map((src, i) => {
        const active = i === index;
        return (
          <div
            key={src}
            className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
            style={{ opacity: active ? 1 : 0, zIndex: active ? 1 : 0 }}
            aria-hidden={!active}
          >
            <Image
              src={src}
              alt="Inside Snow Spoon"
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
              sizes="(max-width: 1024px) 100vw, 1100px"
              className={`object-cover transition-transform ease-out duration-[6000ms] ${
                active ? "scale-100" : "scale-105"
              }`}
            />
          </div>
        );
      })}

      {/* subtle vignette for contrast */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/45 via-transparent to-transparent" />

      {/* caption */}
      <div className="pointer-events-none absolute bottom-5 left-6 right-6 z-10">
        <p className="font-display text-lg font-bold text-white drop-shadow-sm sm:text-xl">
          Bright, cheerful & made for good times ✨
        </p>
      </div>

      {/* arrows */}
      <button
        type="button"
        onClick={() => go(index - 1)}
        aria-label="Previous photo"
        className="absolute left-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-xl text-ink opacity-0 shadow-soft backdrop-blur transition-opacity hover:bg-white group-hover:opacity-100"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(index + 1)}
        aria-label="Next photo"
        className="absolute right-3 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white/80 text-xl text-ink opacity-0 shadow-soft backdrop-blur transition-opacity hover:bg-white group-hover:opacity-100"
      >
        ›
      </button>

      {/* dots */}
      <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        {IMAGES.map((_, d) => (
          <button
            key={d}
            type="button"
            onClick={() => go(d)}
            aria-label={`Go to photo ${d + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              d === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
