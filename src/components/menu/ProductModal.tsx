"use client";

import Image from "next/image";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Star, Flame, Sparkles, Check } from "lucide-react";
import type { MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ProductModal({
  item,
  onClose,
  action,
}: {
  item: MenuItem | null;
  onClose: () => void;
  /** Optional footer control (e.g. an "Add to order" button on the order page). */
  action?: React.ReactNode;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (item) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  const nutrition = item
    ? [
        ["Calories", item.calories, "kcal"],
        ["Protein", item.protein, "g"],
        ["Carbs", item.carbs, "g"],
        ["Fat", item.fat, "g"],
      ].filter(([, v]) => v != null)
    : [];

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.name}
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift sm:rounded-3xl md:flex-row"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute right-3 top-3 z-20 grid size-10 place-items-center rounded-full bg-white/90 text-ink shadow-soft backdrop-blur transition-colors hover:text-brand"
            >
              <X className="size-5" />
            </button>

            {/* Image */}
            <div className="relative aspect-[4/3] w-full shrink-0 bg-cloud md:aspect-auto md:w-[46%]">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-6xl">🍨</div>
              )}
              <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                {item.popular && (
                  <span className="chip bg-white/90 text-brand shadow-soft">
                    <Flame className="size-3.5" /> Popular
                  </span>
                )}
                {item.is_new && (
                  <span className="chip bg-blue text-white shadow-soft">
                    <Sparkles className="size-3.5" /> New
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-6 sm:p-7">
              <div className="flex flex-wrap items-center gap-2">
                {item.category_label && (
                  <span className="chip bg-brand-soft text-brand">{item.category_label}</span>
                )}
                <span
                  className="chip"
                  style={{
                    color: item.veg ? "#16a34a" : "#dc2626",
                    background: item.veg ? "#f0fdf4" : "#fef2f2",
                  }}
                >
                  {item.veg ? "Veg" : "Non-veg"}
                </span>
                <span className="chip bg-amber-50 text-amber-600">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {Number(item.rating).toFixed(1)} · {item.reviews} reviews
                </span>
              </div>

              <h2 className="mt-3 font-display text-2xl font-bold text-ink">{item.name}</h2>

              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {item.long_description || item.description}
              </p>

              {item.ingredients?.length > 0 && (
                <div className="mt-5">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-muted">
                    Ingredients
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.ingredients.map((ing) => (
                      <span
                        key={ing}
                        className="inline-flex items-center gap-1 rounded-full border border-line bg-cloud px-2.5 py-1 text-xs font-medium text-ink-soft"
                      >
                        <Check className="size-3 text-green-600" /> {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {nutrition.length > 0 && (
                <div className="mt-5 grid grid-cols-4 gap-2">
                  {nutrition.map(([label, value, unit]) => (
                    <div
                      key={label as string}
                      className="rounded-2xl bg-cloud px-2 py-3 text-center"
                    >
                      <div className="font-display text-base font-bold text-ink">
                        {value}
                        <span className="text-[10px] font-medium text-muted">{unit}</span>
                      </div>
                      <div className="text-[11px] text-muted">{label}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-auto flex items-center justify-between gap-4 border-t border-line pt-5">
                <div>
                  <div className="font-display text-2xl font-bold text-brand">
                    {formatPrice(item.price)}
                  </div>
                  <div className="text-xs text-muted">
                    {item.available ? "Available now" : "Currently unavailable"}
                  </div>
                </div>
                {action ?? (
                  <span
                    className={`chip px-3 py-1.5 text-sm ${
                      item.available ? "bg-green-50 text-green-700" : "bg-cloud text-muted"
                    }`}
                  >
                    <span
                      className={`size-2 rounded-full ${
                        item.available ? "bg-green-500" : "bg-muted"
                      }`}
                    />
                    {item.available ? "In stock" : "Sold out"}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
