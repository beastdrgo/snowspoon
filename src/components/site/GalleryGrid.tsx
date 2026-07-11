"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryRow } from "@/lib/types";

export function GalleryGrid({ images }: { images: GalleryRow[] }) {
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  return (
    <>
      <div className="columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3">
        {images.map((img, i) => (
          <motion.button
            key={img.id}
            onClick={() => setIndex(i)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 8) * 0.04 }}
            className="group relative block w-full overflow-hidden rounded-2xl shadow-soft"
          >
            <Image
              src={img.image_url}
              alt={img.title ?? "Snow Spoon"}
              width={500}
              height={500}
              sizes="(max-width: 640px) 45vw, 300px"
              className="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {img.title && (
              <span className="absolute bottom-3 left-3 right-3 translate-y-2 text-left text-sm font-semibold text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                {img.title}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/85 backdrop-blur-sm" onClick={close} />

            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X className="size-6" />
            </button>

            <button
              onClick={prev}
              aria-label="Previous"
              className="absolute left-3 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={next}
              aria-label="Next"
              className="absolute right-3 z-10 grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="size-6" />
            </button>

            <motion.div
              key={index}
              className="relative z-0 max-h-[85vh] w-full max-w-3xl"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <Image
                src={images[index].image_url}
                alt={images[index].title ?? "Snow Spoon"}
                width={1200}
                height={900}
                className="mx-auto max-h-[85vh] w-auto rounded-3xl object-contain shadow-lift"
              />
              {images[index].title && (
                <p className="mt-3 text-center text-sm font-medium text-white/90">
                  {images[index].title}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
