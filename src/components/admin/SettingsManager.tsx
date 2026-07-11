"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Plus, Trash2, Store, ImageIcon, Phone, Clock, Share2, MapPin } from "lucide-react";
import type { Branch, OpeningHour, Restaurant } from "@/lib/types";
import { fetchRestaurant, saveRestaurant } from "@/lib/admin/api";
import { ImageUpload } from "./ImageUpload";
import { toast } from "./Toast";

const SECTIONS = [
  { id: "brand", label: "Brand", icon: Store },
  { id: "hero", label: "Hero", icon: ImageIcon },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "hours", label: "Hours", icon: Clock },
  { id: "socials", label: "Socials", icon: Share2 },
  { id: "branches", label: "Branches", icon: MapPin },
] as const;

export function SettingsManager() {
  const { data, isLoading } = useQuery({ queryKey: ["admin-restaurant"], queryFn: fetchRestaurant });
  const [form, setForm] = useState<Restaurant | null>(null);
  const [section, setSection] = useState<(typeof SECTIONS)[number]["id"]>("brand");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  if (isLoading || !form) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 className="size-6 animate-spin text-brand" />
      </div>
    );
  }

  function set<K extends keyof Restaurant>(k: K, v: Restaurant[K]) {
    setForm((f) => (f ? { ...f, [k]: v } : f));
  }

  async function save() {
    if (!form) return;
    setSaving(true);
    try {
      await saveRestaurant(form.id, form);
      toast("Settings saved.");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Save failed.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Settings</h1>
          <p className="mt-1 text-sm text-ink-soft">Restaurant info, hero and contact details.</p>
        </div>
        <button onClick={save} disabled={saving} className="btn btn-primary px-6 py-2.5 text-sm disabled:opacity-70">
          {saving ? <Loader2 className="size-4 animate-spin" /> : "Save changes"}
        </button>
      </div>

      {/* Section tabs */}
      <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto">
        {SECTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setSection(id)}
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              section === id ? "bg-brand text-white shadow-glow" : "border border-line bg-white text-ink-soft hover:text-brand"
            }`}
          >
            <Icon className="size-4" /> {label}
          </button>
        ))}
      </div>

      <div className="card mt-4 rounded-3xl p-6">
        {section === "brand" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="Restaurant name" value={form.name} onChange={(v) => set("name", v)} />
            <Text label="Tagline" value={form.tagline ?? ""} onChange={(v) => set("tagline", v)} />
            <div className="sm:col-span-2">
              <Area label="Description" value={form.description ?? ""} onChange={(v) => set("description", v)} />
            </div>
          </div>
        )}

        {section === "hero" && (
          <div className="grid gap-5 md:grid-cols-[260px_1fr]">
            <div>
              <ImageUpload value={form.hero_image} onChange={(url) => set("hero_image", url)} folder="banners" />
              <Text label="Hero image URL" value={form.hero_image ?? ""} onChange={(v) => set("hero_image", v)} />
            </div>
            <div className="space-y-4">
              <Text label="Hero title" value={form.hero_title ?? ""} onChange={(v) => set("hero_title", v)} />
              <Area label="Hero subtitle" value={form.hero_subtitle ?? ""} onChange={(v) => set("hero_subtitle", v)} />
            </div>
          </div>
        )}

        {section === "contact" && (
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="Phone" value={form.phone ?? ""} onChange={(v) => set("phone", v)} />
            <Text label="Email" value={form.email ?? ""} onChange={(v) => set("email", v)} />
            <div className="sm:col-span-2">
              <Area label="Address" value={form.address ?? ""} onChange={(v) => set("address", v)} />
            </div>
          </div>
        )}

        {section === "hours" && (
          <HoursEditor value={form.hours} onChange={(h) => set("hours", h)} />
        )}

        {section === "socials" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {(["instagram", "facebook", "twitter", "whatsapp"] as const).map((k) => (
              <Text
                key={k}
                label={k[0].toUpperCase() + k.slice(1)}
                value={form.socials[k] ?? ""}
                onChange={(v) => set("socials", { ...form.socials, [k]: v })}
                placeholder={`https://…`}
              />
            ))}
          </div>
        )}

        {section === "branches" && (
          <BranchesEditor value={form.branches} onChange={(b) => set("branches", b)} />
        )}
      </div>
    </div>
  );
}

/* --------------------------- editors --------------------------- */

function HoursEditor({ value, onChange }: { value: OpeningHour[]; onChange: (v: OpeningHour[]) => void }) {
  return (
    <div className="space-y-3">
      {value.map((h, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={h.day}
            placeholder="Mon - Fri"
            onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, day: e.target.value } : x)))}
            className="w-40 rounded-2xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-brand-tint"
          />
          <input
            value={h.time}
            placeholder="11:00 AM - 11:00 PM"
            onChange={(e) => onChange(value.map((x, j) => (j === i ? { ...x, time: e.target.value } : x)))}
            className="flex-1 rounded-2xl border border-line px-3.5 py-2.5 text-sm outline-none focus:border-brand-tint"
          />
          <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="grid size-10 shrink-0 place-items-center rounded-2xl text-red-500 hover:bg-red-50">
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...value, { day: "", time: "" }])} className="btn btn-ghost px-4 py-2.5 text-sm">
        <Plus className="size-4" /> Add row
      </button>
    </div>
  );
}

function BranchesEditor({ value, onChange }: { value: Branch[]; onChange: (v: Branch[]) => void }) {
  const update = (i: number, patch: Partial<Branch>) =>
    onChange(value.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  return (
    <div className="space-y-4">
      {value.map((b, i) => (
        <div key={i} className="rounded-2xl border border-line p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Text label="Branch name" value={b.name ?? ""} onChange={(v) => update(i, { name: v })} />
            <Text label="Phone" value={b.phone ?? ""} onChange={(v) => update(i, { phone: v })} />
          </div>
          <div className="mt-3">
            <Area label="Address" value={b.address ?? ""} onChange={(v) => update(i, { address: v })} />
          </div>
          <button onClick={() => onChange(value.filter((_, j) => j !== i))} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:underline">
            <Trash2 className="size-4" /> Remove branch
          </button>
        </div>
      ))}
      <button onClick={() => onChange([...value, { name: "", phone: "", address: "" }])} className="btn btn-ghost px-4 py-2.5 text-sm">
        <Plus className="size-4" /> Add branch
      </button>
    </div>
  );
}

function Text({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-ink-soft">{label}</label>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-tint focus:ring-4 focus:ring-brand/10"
      />
    </div>
  );
}

function Area({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-ink-soft">{label}</label>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-tint focus:ring-4 focus:ring-brand/10"
      />
    </div>
  );
}
