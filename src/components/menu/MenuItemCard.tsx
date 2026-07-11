"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Plus, Flame, Sparkles } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function MenuItemCard({
  item,
  onSelect,
  priority = false,
}: {
  item: MenuItem;
  onSelect?: (item: MenuItem) => void;
  priority?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect?.(item)}
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group card relative flex w-full flex-col overflow-hidden text-left transition-shadow hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
      aria-label={`View ${item.name}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-cloud">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 260px"
            priority={priority}
            className={`object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 ${
              item.available ? "" : "grayscale"
            }`}
          />
        ) : (
          <div className="grid h-full place-items-center text-4xl">🍨</div>
        )}

        {/* top-left badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.popular && (
            <span className="chip bg-white/90 text-brand shadow-soft backdrop-blur">
              <Flame className="size-3.5" /> Popular
            </span>
          )}
          {item.is_new && (
            <span className="chip bg-blue text-white shadow-soft">
              <Sparkles className="size-3.5" /> New
            </span>
          )}
        </div>

        {/* veg / non-veg */}
        <span
          className="absolute right-3 top-3 grid size-5 place-items-center rounded-[6px] border-2 bg-white/90 backdrop-blur"
          style={{ borderColor: item.veg ? "#16a34a" : "#dc2626" }}
          title={item.veg ? "Veg" : "Non-veg"}
        >
          <span
            className="size-2 rounded-full"
            style={{ background: item.veg ? "#16a34a" : "#dc2626" }}
          />
        </span>

        {!item.available && (
          <div className="absolute inset-x-0 bottom-0 bg-ink/70 py-1.5 text-center text-xs font-semibold text-white backdrop-blur">
            Currently unavailable
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-[0.98rem] font-semibold leading-tight text-ink">
            {item.name}
          </h3>
          <span className="flex shrink-0 items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-xs font-semibold text-amber-600">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {Number(item.rating).toFixed(1)}
          </span>
        </div>

        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-ink-soft">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-display text-lg font-bold text-brand">
            {formatPrice(item.price)}
          </span>
          <span className="grid size-9 place-items-center rounded-full bg-brand text-white shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90">
            <Plus className="size-4.5" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}
