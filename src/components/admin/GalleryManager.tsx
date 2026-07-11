"use client";

import Image from "next/image";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Trash2, Loader2, X } from "lucide-react";
import type { GalleryRow } from "@/lib/types";
import { fetchGallery, addGalleryImage, deleteGalleryImage } from "@/lib/admin/api";
import { ImageUpload } from "./ImageUpload";
import { ConfirmDialog } from "./ConfirmDialog";
import { toast } from "./Toast";

export function GalleryManager() {
  const qc = useQueryClient();
  const { data: images = [], isLoading } = useQuery({ queryKey: ["admin-gallery"], queryFn: fetchGallery });

  const [adding, setAdding] = useState(false);
  const [confirm, setConfirm] = useState<GalleryRow | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-gallery"] });

  async function runDelete() {
    if (!confirm) return;
    setBusy(true);
    try {
      await deleteGalleryImage(confirm.id);
      toast("Image removed.");
      refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed.", "error");
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Gallery</h1>
          <p className="mt-1 text-sm text-ink-soft">{images.length} images shown on the public gallery.</p>
        </div>
        <button onClick={() => setAdding(true)} className="btn btn-primary px-5 py-2.5 text-sm">
          <Plus className="size-4.5" /> Add image
        </button>
      </div>

      {isLoading ? (
        <div className="grid place-items-center py-20"><Loader2 className="size-6 animate-spin text-brand" /></div>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((img) => (
            <div key={img.id} className="card group relative overflow-hidden rounded-2xl">
              <div className="relative aspect-square">
                <Image src={img.image_url} alt={img.title ?? "Gallery"} fill sizes="200px" className="object-cover" />
              </div>
              {img.title && <p className="truncate px-3 py-2 text-xs font-medium text-ink">{img.title}</p>}
              <button
                onClick={() => setConfirm(img)}
                className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/90 text-red-500 opacity-0 shadow-soft transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <p className="col-span-full py-16 text-center text-sm text-muted">No gallery images yet.</p>
          )}
        </div>
      )}

      <AddGalleryModal open={adding} onClose={() => setAdding(false)} onSaved={refresh} nextOrder={images.length + 1} />

      <ConfirmDialog
        open={confirm !== null}
        title="Remove image"
        message="Remove this image from the gallery?"
        confirmLabel="Remove"
        busy={busy}
        onCancelAction={() => setConfirm(null)}
        onConfirmAction={runDelete}
      />
    </div>
  );
}

function AddGalleryModal({
  open,
  onClose,
  onSaved,
  nextOrder,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  nextOrder: number;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!url) return toast("Upload or paste an image first.", "error");
    setSaving(true);
    try {
      await addGalleryImage({ image_url: url, title: title || null, sort_order: nextOrder });
      toast("Image added to gallery.");
      setUrl(null);
      setTitle("");
      onSaved();
      onClose();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Failed to add.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80] grid place-items-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-lift"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-ink">Add gallery image</h2>
              <button onClick={onClose} className="grid size-9 place-items-center rounded-full text-muted hover:bg-cloud"><X className="size-5" /></button>
            </div>
            <ImageUpload value={url} onChange={setUrl} folder="gallery" aspect="aspect-square" />
            <div className="mt-3">
              <label className="mb-1 block text-xs font-semibold text-ink-soft">Image URL</label>
              <input value={url ?? ""} onChange={(e) => setUrl(e.target.value || null)} placeholder="https://…" className="w-full rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-tint" />
            </div>
            <div className="mt-3">
              <label className="mb-1 block text-xs font-semibold text-ink-soft">Title (optional)</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brownie Fudge" className="w-full rounded-2xl border border-line bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-tint" />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={onClose} className="btn btn-ghost px-5 py-2.5 text-sm">Cancel</button>
              <button onClick={save} disabled={saving} className="btn btn-primary px-6 py-2.5 text-sm disabled:opacity-70">
                {saving ? <Loader2 className="size-4 animate-spin" /> : "Add image"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
