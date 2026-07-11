"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Pencil, Trash2, Loader2, X, GripVertical } from "lucide-react";
import type { Category } from "@/lib/types";
import { fetchCategories, fetchMenuItems, saveCategory, deleteCategory } from "@/lib/admin/api";
import { slugify } from "@/lib/format";
import { LucideIcon } from "@/components/ui/LucideIcon";
import { ConfirmDialog } from "./ConfirmDialog";
import { toast } from "./Toast";

type FormCat = Partial<Category> & { id?: string };

export function CategoryManager() {
  const qc = useQueryClient();
  const { data: categories = [], isLoading } = useQuery({ queryKey: ["admin-categories"], queryFn: fetchCategories });
  const { data: items = [] } = useQuery({ queryKey: ["admin-menu"], queryFn: fetchMenuItems });

  const [editing, setEditing] = useState<FormCat | null>(null);
  const [confirm, setConfirm] = useState<Category | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-categories"] });
  const countFor = (id: string) => items.filter((i) => i.category_id === id).length;

  async function runDelete() {
    if (!confirm) return;
    if (countFor(confirm.id) > 0) {
      toast("Move or delete this category's items first.", "error");
      setConfirm(null);
      return;
    }
    setBusy(true);
    try {
      await deleteCategory(confirm.id);
      toast("Category deleted.");
      refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed.", "error");
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Categories</h1>
          <p className="mt-1 text-sm text-ink-soft">{categories.length} categories. Order controls how they appear.</p>
        </div>
        <button onClick={() => setEditing({ sort_order: categories.length + 1 })} className="btn btn-primary px-5 py-2.5 text-sm">
          <Plus className="size-4.5" /> Add category
        </button>
      </div>

      <div className="card mt-5 overflow-hidden rounded-3xl">
        {isLoading ? (
          <div className="grid place-items-center py-16"><Loader2 className="size-6 animate-spin text-brand" /></div>
        ) : (
          <ul className="divide-y divide-line">
            {categories.map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                <GripVertical className="size-4 shrink-0 text-line" />
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-brand-soft text-brand">
                  {c.lucide ? <LucideIcon name={c.lucide} className="size-5" /> : <span>{c.icon}</span>}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-ink">{c.label}</p>
                  <p className="text-xs text-muted">/{c.slug} · {countFor(c.id)} items</p>
                </div>
                <span className="hidden rounded-full bg-cloud px-2.5 py-1 text-xs font-semibold text-muted sm:inline">
                  #{c.sort_order}
                </span>
                <button onClick={() => setEditing(c)} className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-cloud hover:text-brand">
                  <Pencil className="size-4" />
                </button>
                <button onClick={() => setConfirm(c)} className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-cloud hover:text-red-600">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CategoryForm cat={editing} onClose={() => setEditing(null)} onSaved={refresh} />

      <ConfirmDialog
        open={confirm !== null}
        title="Delete category"
        message={`Delete "${confirm?.label}"?`}
        confirmLabel="Delete"
        busy={busy}
        onCancelAction={() => setConfirm(null)}
        onConfirmAction={runDelete}
      />
    </div>
  );
}

function CategoryForm({
  cat,
  onClose,
  onSaved,
}: {
  cat: FormCat | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const open = cat !== null;
  const [form, setForm] = useState<FormCat>({ ...cat });
  const [slugTouched, setSlugTouched] = useState(Boolean(cat?.id));
  const [saving, setSaving] = useState(false);

  // keep form in sync when opening a different category
  const key = cat?.id ?? (open ? "new" : "closed");
  useEffect(() => {
    if (cat) {
      setForm({ ...cat });
      setSlugTouched(Boolean(cat.id));
    }
  }, [cat]);

  function set<K extends keyof FormCat>(k: K, v: FormCat[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.label?.trim()) return toast("Label is required.", "error");
    const slug = (form.slug || slugify(form.label)).trim();
    setSaving(true);
    try {
      await saveCategory({
        id: form.id,
        label: form.label.trim(),
        slug,
        short: form.short || null,
        icon: form.icon || null,
        lucide: form.lucide || null,
        sort_order: Number(form.sort_order) || 0,
      });
      toast(form.id ? "Category updated." : "Category created.");
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
        <motion.div key={key} className="fixed inset-0 z-[80] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-md rounded-3xl bg-white p-6 shadow-lift"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">{form.id ? "Edit category" : "New category"}</h2>
              <button onClick={onClose} className="grid size-9 place-items-center rounded-full text-muted hover:bg-cloud"><X className="size-5" /></button>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <F label="Label *" value={form.label ?? ""} onChange={(v) => { set("label", v); if (!slugTouched) set("slug", slugify(v)); }} placeholder="Sundaes" />
                <F label="Slug *" value={form.slug ?? ""} onChange={(v) => { setSlugTouched(true); set("slug", slugify(v)); }} placeholder="sundaes" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <F label="Short" value={form.short ?? ""} onChange={(v) => set("short", v)} placeholder="Sundaes" />
                <F label="Emoji" value={form.icon ?? ""} onChange={(v) => set("icon", v)} placeholder="🍨" />
                <F label="Order" type="number" value={String(form.sort_order ?? 0)} onChange={(v) => set("sort_order", Number(v) as never)} />
              </div>
              <div>
                <F label="Lucide icon name" value={form.lucide ?? ""} onChange={(v) => set("lucide", v)} placeholder="IceCreamBowl" />
                <p className="mt-1 flex items-center gap-2 text-xs text-muted">
                  {form.lucide && <LucideIcon name={form.lucide} className="size-4 text-brand" />}
                  Names from lucide.dev (PascalCase). Falls back to emoji.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="btn btn-ghost px-5 py-2.5 text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-primary px-6 py-2.5 text-sm disabled:opacity-70">
                  {saving ? <Loader2 className="size-4 animate-spin" /> : form.id ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function F({
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
      <label className="mb-1 block text-xs font-semibold text-ink-soft">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-tint focus:ring-4 focus:ring-brand/10"
      />
    </div>
  );
}
