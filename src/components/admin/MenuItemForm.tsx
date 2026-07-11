"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import type { Category, MenuItemRow } from "@/lib/types";
import { saveMenuItem } from "@/lib/admin/api";
import { slugify } from "@/lib/format";
import { ImageUpload } from "./ImageUpload";
import { toast } from "./Toast";

type FormItem = Partial<MenuItemRow> & { id?: string };

const emptyItem: FormItem = {
  name: "",
  slug: "",
  price: 0,
  description: "",
  long_description: "",
  image_url: "",
  ingredients: [],
  veg: true,
  popular: false,
  is_new: false,
  available: true,
  rating: 4.8,
  reviews: 0,
  sort_order: 0,
};

export function MenuItemForm({
  item,
  categories,
  onClose,
  onSaved,
}: {
  item: FormItem | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const open = item !== null;
  const [form, setForm] = useState<FormItem>({ ...emptyItem, ...item });
  const [slugTouched, setSlugTouched] = useState(Boolean(item?.id));
  const [saving, setSaving] = useState(false);

  // Reset the form whenever a different item is opened for editing.
  useEffect(() => {
    if (item) {
      setForm({ ...emptyItem, ...item });
      setSlugTouched(Boolean(item.id));
    }
  }, [item]);

  function set<K extends keyof FormItem>(key: K, val: FormItem[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name?.trim()) return toast("Name is required.", "error");
    const slug = (form.slug || slugify(form.name)).trim();
    if (!slug) return toast("Slug is required.", "error");
    if (!form.category_id) return toast("Please pick a category.", "error");

    setSaving(true);
    try {
      await saveMenuItem({
        id: form.id,
        name: form.name.trim(),
        slug,
        category_id: form.category_id,
        price: Number(form.price) || 0,
        description: form.description || null,
        long_description: form.long_description || null,
        image_url: form.image_url || null,
        ingredients: form.ingredients ?? [],
        calories: numOrNull(form.calories),
        protein: numOrNull(form.protein),
        carbs: numOrNull(form.carbs),
        fat: numOrNull(form.fat),
        rating: Number(form.rating) || 4.8,
        reviews: Number(form.reviews) || 0,
        veg: form.veg ?? true,
        popular: form.popular ?? false,
        is_new: form.is_new ?? false,
        available: form.available ?? true,
        sort_order: Number(form.sort_order) || 0,
      });
      toast(form.id ? "Item updated." : "Item created.");
      onSaved();
      onClose();
    } catch (err) {
      toast(err instanceof Error ? err.message : "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 flex max-h-[94vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift sm:rounded-3xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-display text-lg font-bold text-ink">
                {form.id ? "Edit menu item" : "New menu item"}
              </h2>
              <button onClick={onClose} className="grid size-9 place-items-center rounded-full text-muted hover:bg-cloud">
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-5 overflow-y-auto p-6 md:grid-cols-[220px_1fr]">
              {/* Left: image + toggles */}
              <div className="space-y-4">
                <ImageUpload value={form.image_url ?? null} onChange={(url) => set("image_url", url ?? "")} />
                <Input label="Image URL" value={form.image_url ?? ""} onChange={(v) => set("image_url", v)} placeholder="/images/... or https://" />

                <div className="space-y-2 rounded-2xl bg-cloud p-3">
                  <Toggle label="Available" checked={form.available ?? true} onChange={(v) => set("available", v)} />
                  <Toggle label="Popular" checked={form.popular ?? false} onChange={(v) => set("popular", v)} />
                  <Toggle label="New arrival" checked={form.is_new ?? false} onChange={(v) => set("is_new", v)} />
                  <Toggle label="Vegetarian" checked={form.veg ?? true} onChange={(v) => set("veg", v)} />
                </div>
              </div>

              {/* Right: fields */}
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Name *"
                    value={form.name ?? ""}
                    onChange={(v) => {
                      set("name", v);
                      if (!slugTouched) set("slug", slugify(v));
                    }}
                    placeholder="Classic Sundae"
                  />
                  <Input
                    label="Slug *"
                    value={form.slug ?? ""}
                    onChange={(v) => {
                      setSlugTouched(true);
                      set("slug", slugify(v));
                    }}
                    placeholder="classic-sundae"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Category *</Label>
                    <select
                      value={form.category_id ?? ""}
                      onChange={(e) => set("category_id", e.target.value)}
                      className="w-full rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-tint"
                    >
                      <option value="">Select…</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input label="Price (₹)" type="number" value={String(form.price ?? 0)} onChange={(v) => set("price", Number(v))} />
                </div>

                <Textarea label="Short description" value={form.description ?? ""} onChange={(v) => set("description", v)} rows={2} placeholder="One-line teaser shown on the card." />
                <Textarea label="Full description" value={form.long_description ?? ""} onChange={(v) => set("long_description", v)} rows={3} placeholder="Shown in the product detail popup." />

                <Input
                  label="Ingredients (comma-separated)"
                  value={(form.ingredients ?? []).join(", ")}
                  onChange={(v) => set("ingredients", v.split(",").map((s) => s.trim()).filter(Boolean))}
                  placeholder="Vanilla, Fudge, Nuts"
                />

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Input label="Calories" type="number" value={numStr(form.calories)} onChange={(v) => set("calories", v === "" ? null : Number(v))} />
                  <Input label="Protein (g)" type="number" value={numStr(form.protein)} onChange={(v) => set("protein", v === "" ? null : Number(v))} />
                  <Input label="Carbs (g)" type="number" value={numStr(form.carbs)} onChange={(v) => set("carbs", v === "" ? null : Number(v))} />
                  <Input label="Fat (g)" type="number" value={numStr(form.fat)} onChange={(v) => set("fat", v === "" ? null : Number(v))} />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <Input label="Rating" type="number" value={String(form.rating ?? 4.8)} onChange={(v) => set("rating", Number(v))} />
                  <Input label="Reviews" type="number" value={String(form.reviews ?? 0)} onChange={(v) => set("reviews", Number(v))} />
                  <Input label="Sort order" type="number" value={String(form.sort_order ?? 0)} onChange={(v) => set("sort_order", Number(v))} />
                </div>
              </div>

              <div className="sticky bottom-0 -mx-6 -mb-6 flex justify-end gap-3 border-t border-line bg-white px-6 py-4 md:col-span-2">
                <button type="button" onClick={onClose} className="btn btn-ghost px-5 py-2.5 text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="btn btn-primary px-6 py-2.5 text-sm disabled:opacity-70">
                  {saving ? <Loader2 className="size-4 animate-spin" /> : form.id ? "Save changes" : "Create item"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}
function numStr(v: number | null | undefined): string {
  return v === null || v === undefined ? "" : String(v);
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-xs font-semibold text-ink-soft">{children}</label>;
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        step={type === "number" ? "any" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-tint focus:ring-4 focus:ring-brand/10"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-tint focus:ring-4 focus:ring-brand/10"
      />
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-sm font-medium text-ink">
      {label}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${checked ? "bg-brand" : "bg-line"}`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
