"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import type { Restaurant } from "@/lib/types";

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero({ restaurant }: { restaurant: Restaurant | null }) {
  const heroImage = restaurant?.hero_image ?? "/images/dessert-platter.jpeg";
  const tagline = restaurant?.tagline ?? "Scoops of joy in every bite";

  return (
    <section className="relative overflow-hidden">
      {/* soft blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 -z-10 size-72 rounded-full bg-blue-soft blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 -z-10 size-80 rounded-full bg-brand-soft blur-3xl" />

      <div className="container-page grid items-center gap-10 py-12 md:grid-cols-[1.05fr_1fr] md:py-20">
        {/* Copy */}
        <div>
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="chip bg-white text-brand shadow-soft"
          >
            <Sparkles className="size-3.5" /> {tagline}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.08 }}
            className="mt-5 font-display text-5xl font-extrabold leading-[1.02] text-ink sm:text-6xl md:text-7xl"
          >
            Desserts that <span className="text-gradient">melt</span> your heart.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.16 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft"
          >
            {restaurant?.description ??
              "Premium sundaes, thick shakes, kulfi and desserts — freshly prepared with premium ingredients and served with love."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.24 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Link href="/menu" className="btn btn-primary px-7 py-3.5 text-base">
              Explore Menu <ArrowRight className="size-4.5" />
            </Link>
            <Link href="/about" className="btn btn-ghost px-7 py-3.5 text-base">
              Our Story
            </Link>
          </motion.div>

          {/* social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.36 }}
            className="mt-9 flex items-center gap-5"
          >
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1.5 text-sm font-semibold text-ink">4.9</span>
            </div>
            <div className="h-8 w-px bg-line" />
            <p className="text-sm text-ink-soft">
              Loved by <span className="font-semibold text-ink">10,000+</span> dessert fans
            </p>
          </motion.div>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, ease }}
          className="relative mx-auto aspect-square w-full max-w-md"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 -z-10 rounded-full border border-dashed border-brand/20"
          />
          <div className="absolute inset-6 -z-10 rounded-full bg-gradient-to-br from-brand-soft via-white to-blue-soft" />

          <div className="relative h-full overflow-hidden rounded-full border-[10px] border-white shadow-lift">
            <Image
              src={heroImage}
              alt="Snow Spoon signature dessert"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 440px"
              className="object-cover"
            />
          </div>

          {/* floating chips */}
          <FloatingChip className="left-0 top-8" delay={0}>
            🍦 <span className="font-semibold">Fresh Daily</span>
          </FloatingChip>
          <FloatingChip className="right-0 top-24" delay={1.2}>
            🍓 <span className="font-semibold">Real Fruit</span>
          </FloatingChip>
          <FloatingChip className="bottom-10 left-4" delay={0.6}>
            ⭐ <span className="font-semibold">Top Rated</span>
          </FloatingChip>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingChip({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay: 0.6 + delay, duration: 0.5 },
        scale: { delay: 0.6 + delay, duration: 0.5 },
        y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
      }}
      className={`absolute inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3.5 py-2 text-sm shadow-lift backdrop-blur ${className}`}
    >
      {children}
    </motion.div>
  );
}
