"use client";

import { useMemo, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, Leaf, CheckCircle2, X, UtensilsCrossed } from "lucide-react";
import type { Category, MenuItem } from "@/lib/types";
import { useMenuStore, type SortKey } from "@/store/menu";
import { MenuItemCard } from "./MenuItemCard";
import { ProductModal } from "./ProductModal";
import { LucideIcon } from "@/components/ui/LucideIcon";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
  { key: "name", label: "Alphabetical" },
];

export function MenuExplorer({
  categories,
  items,
}: {
  categories: Category[];
  items: MenuItem[];
}) {
  const {
    query,
    category,
    sort,
    onlyAvailable,
    onlyVeg,
    selected,
    setQuery,
    setCategory,
    setSort,
    toggleAvailable,
    toggleVeg,
    select,
  } = useMenuStore();

  const railRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const it of items) {
      if (it.category_slug) map[it.category_slug] = (map[it.category_slug] ?? 0) + 1;
    }
    return map;
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = items.filter((it) => {
      if (category !== "all" && it.category_slug !== category) return false;
      if (onlyAvailable && !it.available) return false;
      if (onlyVeg && !it.veg) return false;
      if (q) {
        const hay = `${it.name} ${it.description ?? ""} ${it.category_label ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "newest":
          return +new Date(b.created_at) - +new Date(a.created_at);
        default:
          // featured: manual admin drag order (sort_order), name as tiebreak
          if (a.sort_order !== b.sort_order) return a.sort_order - b.sort_order;
          return a.name.localeCompare(b.name);
      }
    });
    return list;
  }, [items, category, query, sort, onlyAvailable, onlyVeg]);

  const activeCategory = categories.find((c) => c.slug === category);

  return (
    <section className="container-page pb-8">
      <div className="grid min-w-0 gap-6 lg:grid-cols-[248px_1fr]">
        {/* ---------------- Sidebar (desktop) ---------------- */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="px-3 pb-2 text-xs font-bold uppercase tracking-wide text-muted">
              Categories
            </p>
            <ul className="space-y-1">
              <SidebarItem
                active={category === "all"}
                label="All Items"
                emoji="✨"
                count={items.length}
                onClick={() => setCategory("all")}
              />
              {categories.map((c) => (
                <SidebarItem
                  key={c.id}
                  active={category === c.slug}
                  label={c.label}
                  emoji={c.icon ?? "🍽️"}
                  lucide={c.lucide}
                  count={counts[c.slug] ?? 0}
                  onClick={() => setCategory(c.slug)}
                />
              ))}
            </ul>
          </div>
        </aside>

        {/* ---------------- Main ---------------- */}
        <div className="min-w-0">
          {/* Toolbar */}
          <div className="sticky top-[4.5rem] z-30 -mx-1 mb-5 rounded-3xl">
            <div className="glass card rounded-3xl p-3 sm:p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search sundaes, shakes, snacks…"
                    className="w-full rounded-full border border-line bg-white py-3 pl-11 pr-10 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-brand-tint focus:ring-4 focus:ring-brand/10"
                    aria-label="Search menu"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      aria-label="Clear search"
                      className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-cloud"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>

                {/* Sort */}
                <div className="relative">
                  <SlidersHorizontal className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" />
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    aria-label="Sort menu"
                    className="w-full appearance-none rounded-full border border-line bg-white py-3 pl-9 pr-8 text-sm font-medium text-ink outline-none focus:border-brand-tint sm:w-auto"
                  >
                    {SORTS.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filters + pills */}
              <div className="mt-3 flex items-center gap-2">
                <FilterToggle active={onlyVeg} onClick={toggleVeg} icon={<Leaf className="size-3.5" />}>
                  Veg only
                </FilterToggle>
                <FilterToggle
                  active={onlyAvailable}
                  onClick={toggleAvailable}
                  icon={<CheckCircle2 className="size-3.5" />}
                >
                  Available
                </FilterToggle>
              </div>

              {/* Category pills rail */}
              <div
                ref={railRef}
                className="no-scrollbar mask-fade-r mt-3 flex gap-2 overflow-x-auto pb-1"
              >
                <Pill active={category === "all"} onClick={() => setCategory("all")}>
                  All
                </Pill>
                {categories.map((c) => (
                  <Pill key={c.id} active={category === c.slug} onClick={() => setCategory(c.slug)}>
                    <span className="text-[0.95em]">{c.icon}</span> {c.short ?? c.label}
                  </Pill>
                ))}
              </div>
            </div>
          </div>

          {/* Header row */}
          <div className="mb-4 flex items-end justify-between px-1">
            <div>
              <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
                {activeCategory ? activeCategory.label : "All Items"}
              </h2>
              <p className="text-sm text-muted">
                {filtered.length} {filtered.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4"
              initial="hidden"
              animate="show"
              transition={{ staggerChildren: 0.025, delayChildren: 0 }}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <motion.div key={item.id} layout exit={{ opacity: 0, scale: 0.9 }}>
                    <MenuItemCard item={item} onSelect={select} priority={i < 4} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <ProductModal item={selected} onClose={() => select(null)} />
    </section>
  );
}

/* ---------------- sub-components ---------------- */

function SidebarItem({
  active,
  label,
  emoji,
  lucide,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  emoji: string;
  lucide?: string | null;
  count: number;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`group relative flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
          active ? "bg-brand-soft text-brand" : "text-ink-soft hover:bg-cloud"
        }`}
      >
        {active && (
          <motion.span
            layoutId="sidebar-active"
            className="absolute inset-0 -z-10 rounded-2xl bg-brand-soft"
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
          />
        )}
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-xl border transition-colors ${
            active ? "border-brand-tint bg-white text-brand" : "border-line bg-white text-ink-soft"
          }`}
        >
          {lucide ? <LucideIcon name={lucide} className="size-4.5" /> : <span>{emoji}</span>}
        </span>
        <span className="flex-1 truncate">{label}</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-bold ${
            active ? "bg-brand text-white" : "bg-cloud text-muted"
          }`}
        >
          {count}
        </span>
      </button>
    </li>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
        active
          ? "bg-brand text-white shadow-glow"
          : "border border-line bg-white text-ink-soft hover:border-brand-tint hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

function FilterToggle({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-line bg-white text-ink-soft hover:bg-cloud"
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function EmptyState() {
  const reset = useMenuStore((s) => s.reset);
  return (
    <div className="card grid place-items-center rounded-3xl px-6 py-16 text-center">
      <div className="grid size-16 place-items-center rounded-full bg-brand-soft text-brand">
        <UtensilsCrossed className="size-7" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold text-ink">No items found</h3>
      <p className="mt-1 max-w-xs text-sm text-muted">
        Try a different search or clear your filters to see the full menu.
      </p>
      <button onClick={reset} className="btn btn-ghost mt-5 px-5 py-2.5 text-sm">
        Reset filters
      </button>
    </div>
  );
}
