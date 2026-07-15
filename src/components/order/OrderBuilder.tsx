"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, MapPin, MessageCircle, UtensilsCrossed, ShieldAlert } from "lucide-react";
import type { Category, MenuItem } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { WhatsappIcon } from "@/components/ui/BrandIcons";
import { ProductModal } from "@/components/menu/ProductModal";

export function OrderBuilder({
  items,
  categories,
  table,
  tampered = false,
  whatsappNumber,
}: {
  items: MenuItem[];
  categories: Category[];
  table: string | null;
  tampered?: boolean;
  whatsappNumber: string;
}) {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [tableNo, setTableNo] = useState(table ?? "");
  const [note, setNote] = useState("");
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<MenuItem | null>(null);

  const setItemQty = (id: string, n: number) =>
    setQty((prev) => {
      const next = { ...prev };
      if (n <= 0) delete next[id];
      else next[id] = n;
      return next;
    });

  const filtered = useMemo(
    () => (category === "all" ? items : items.filter((i) => i.category_slug === category)),
    [items, category]
  );

  const order = useMemo(() => {
    const lines = items
      .filter((i) => qty[i.id])
      .map((i) => ({ item: i, count: qty[i.id], subtotal: qty[i.id] * i.price }));
    const total = lines.reduce((s, l) => s + l.subtotal, 0);
    const count = lines.reduce((s, l) => s + l.count, 0);
    return { lines, total, count };
  }, [items, qty]);

  const waHref = useMemo(() => {
    const lines = order.lines
      .map((l) => `• ${l.count} × ${l.item.name} — ${formatPrice(l.subtotal)}`)
      .join("\n");
    const msg =
      `*New Order — Snow Spoon* 🍨\n` +
      (tableNo ? `*Table:* ${tableNo}\n` : "") +
      `\n${lines}\n\n*Total: ${formatPrice(order.total)}*` +
      (note.trim() ? `\n\n*Note:* ${note.trim()}` : "");
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }, [order, tableNo, note, whatsappNumber]);

  if (tampered) {
    return (
      <div className="card mx-auto max-w-md rounded-3xl p-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-red-50 text-red-500">
          <ShieldAlert className="size-7" />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold text-ink">This QR code isn&apos;t valid</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          Please scan the official QR code printed on your table to place an order. If this keeps
          happening, ask our staff for help.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-32">
      {/* table banner */}
      <div className="card mx-auto mb-6 flex max-w-3xl items-center gap-3 rounded-2xl p-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
          <MapPin className="size-5" />
        </span>
        {table ? (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">You're ordering at</p>
            <p className="font-display text-lg font-bold text-ink">Table {table}</p>
          </div>
        ) : (
          <div className="flex-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-muted">
              Your table number
            </label>
            <input
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              placeholder="e.g. 5"
              inputMode="numeric"
              className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus:border-brand-tint"
            />
          </div>
        )}
      </div>

      {/* category filter */}
      <div className="mx-auto mb-5 max-w-3xl">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <Chip active={category === "all"} onClick={() => setCategory("all")}>
            All
          </Chip>
          {categories.map((c) => (
            <Chip key={c.id} active={category === c.slug} onClick={() => setCategory(c.slug)}>
              <span>{c.icon}</span> {c.short ?? c.label}
            </Chip>
          ))}
        </div>
      </div>

      {/* items */}
      <div className="mx-auto grid max-w-3xl grid-cols-1 gap-3">
        {filtered.map((item) => {
          const count = qty[item.id] ?? 0;
          return (
            <div
              key={item.id}
              className={`card flex items-center gap-3 rounded-2xl p-3 transition-shadow ${
                count ? "ring-2 ring-brand/30" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setSelected(item)}
                aria-label={`View ${item.name} details`}
                className="flex min-w-0 flex-1 items-center gap-3 text-left"
              >
                <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-cloud">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill sizes="64px" className="object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center text-2xl">🍨</span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-ink">{item.name}</p>
                  {item.description && (
                    <p className="line-clamp-1 text-xs text-muted">{item.description}</p>
                  )}
                  <p className="mt-0.5 font-display font-bold text-brand">{formatPrice(item.price)}</p>
                </div>
              </button>

              {count === 0 ? (
                <button
                  type="button"
                  onClick={() => setItemQty(item.id, 1)}
                  className="btn btn-ghost shrink-0 px-4 py-2 text-sm"
                >
                  <Plus className="size-4" /> Add
                </button>
              ) : (
                <div className="flex shrink-0 items-center gap-2 rounded-full bg-brand px-1.5 py-1.5 text-white">
                  <button
                    type="button"
                    onClick={() => setItemQty(item.id, count - 1)}
                    aria-label={`Remove one ${item.name}`}
                    className="grid size-7 place-items-center rounded-full transition-colors hover:bg-white/20"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-5 text-center text-sm font-bold tabular-nums">{count}</span>
                  <button
                    type="button"
                    onClick={() => setItemQty(item.id, count + 1)}
                    aria-label={`Add one ${item.name}`}
                    className="grid size-7 place-items-center rounded-full transition-colors hover:bg-white/20"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card grid place-items-center rounded-2xl py-14 text-center text-sm text-muted">
            <UtensilsCrossed className="mb-2 size-6" />
            No items in this category.
          </div>
        )}
      </div>

      {/* note */}
      {order.count > 0 && (
        <div className="mx-auto mt-4 max-w-3xl">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Any special request? (e.g. less sweet, no nuts) — optional"
            className="w-full resize-none rounded-2xl border border-line bg-white p-3 text-sm outline-none focus:border-brand-tint"
          />
        </div>
      )}

      {/* sticky order bar */}
      <AnimatePresence>
        {order.count > 0 && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/90 backdrop-blur-lg"
          >
            <div className="container-page flex items-center justify-between gap-3 py-3.5">
              <div className="flex items-center gap-3">
                <span className="relative grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <ShoppingBag className="size-5" />
                  <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-brand text-[0.7rem] font-bold text-white">
                    {order.count}
                  </span>
                </span>
                <div>
                  <p className="text-xs text-muted">{order.count} item{order.count > 1 ? "s" : ""}</p>
                  <p className="font-display text-lg font-bold text-ink">{formatPrice(order.total)}</p>
                </div>
              </div>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className={`btn px-5 py-3 text-sm font-bold text-white ${
                  tableNo ? "bg-[#25D366] hover:brightness-105" : "pointer-events-none bg-muted"
                }`}
                aria-disabled={!tableNo}
              >
                <WhatsappIcon className="size-5" />
                {tableNo ? "Send order on WhatsApp" : "Enter table number"}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* how it works */}
      <p className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-1.5 text-center text-xs text-muted">
        <MessageCircle className="size-3.5" />
        Your order opens in WhatsApp pre-filled — just tap send, and the kitchen gets it.
      </p>

      {/* product detail popup with an add-to-order control */}
      <ProductModal
        item={selected}
        onClose={() => setSelected(null)}
        action={
          selected ? (
            (qty[selected.id] ?? 0) === 0 ? (
              <button
                type="button"
                onClick={() => setItemQty(selected.id, 1)}
                className="btn btn-primary px-6 py-3 text-sm"
              >
                <Plus className="size-4" /> Add to order
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-full bg-brand px-2 py-2 text-white">
                <button
                  type="button"
                  onClick={() => setItemQty(selected.id, (qty[selected.id] ?? 0) - 1)}
                  aria-label="Remove one"
                  className="grid size-8 place-items-center rounded-full transition-colors hover:bg-white/20"
                >
                  <Minus className="size-4" />
                </button>
                <span className="min-w-6 text-center text-base font-bold tabular-nums">
                  {qty[selected.id]}
                </span>
                <button
                  type="button"
                  onClick={() => setItemQty(selected.id, (qty[selected.id] ?? 0) + 1)}
                  aria-label="Add one"
                  className="grid size-8 place-items-center rounded-full transition-colors hover:bg-white/20"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            )
          ) : undefined
        }
      />
    </div>
  );
}

function Chip({
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
      type="button"
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
