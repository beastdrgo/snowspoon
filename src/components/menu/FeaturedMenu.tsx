"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { MenuItem } from "@/lib/types";
import { MenuItemCard } from "./MenuItemCard";
import { ProductModal } from "./ProductModal";

export function FeaturedMenu({ items }: { items: MenuItem[] }) {
  const [selected, setSelected] = useState<MenuItem | null>(null);

  return (
    <>
      <motion.div
        className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        transition={{ staggerChildren: 0.08 }}
      >
        {items.map((item, i) => (
          <MenuItemCard key={item.id} item={item} onSelect={setSelected} priority={i < 4} />
        ))}
      </motion.div>

      <ProductModal item={selected} onClose={() => setSelected(null)} />
    </>
  );
}
