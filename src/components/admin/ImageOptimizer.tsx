"use client";

import { useState } from "react";
import { ImageDown, Loader2, Check, Sparkles } from "lucide-react";
import { fetchMenuItems, optimizeImageByUrl, updateMenuItemImage } from "@/lib/admin/api";
import { toast } from "./Toast";

type Progress = { done: number; total: number; optimized: number; savedKB: number };

export function ImageOptimizer() {
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState<Progress>({ done: 0, total: 0, optimized: 0, savedKB: 0 });

  async function run() {
    setRunning(true);
    setFinished(false);
    try {
      const items = await fetchMenuItems();
      const targets = items.filter((i) => i.image_url && i.image_url.includes("supabase.co"));
      setProgress({ done: 0, total: targets.length, optimized: 0, savedKB: 0 });

      let optimized = 0;
      let savedKB = 0;
      for (const item of targets) {
        try {
          const r = await optimizeImageByUrl(item.image_url as string, "menu");
          if (r) {
            await updateMenuItemImage(item.id, r.url);
            optimized += 1;
            savedKB += r.oldKB - r.newKB;
          }
        } catch {
          /* skip this image, keep going */
        }
        setProgress((p) => ({ ...p, done: p.done + 1, optimized, savedKB }));
      }

      setFinished(true);
      toast(
        optimized > 0
          ? `Optimized ${optimized} image${optimized === 1 ? "" : "s"} — saved ${(savedKB / 1024).toFixed(1)} MB.`
          : "All images are already optimized.",
      );
    } catch (e) {
      toast(e instanceof Error ? e.message : "Couldn't optimize images.", "error");
    } finally {
      setRunning(false);
    }
  }

  const pct = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div className="card rounded-3xl p-6">
      <div className="flex items-start gap-3">
        <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-soft text-blue">
          <ImageDown className="size-5" />
        </span>
        <div className="flex-1">
          <h2 className="font-display text-lg font-bold text-ink">Optimize images</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            Compress your existing menu photos so the menu loads fast on phones. New uploads are
            already optimized automatically — this fixes older, heavy images.
          </p>
        </div>
      </div>

      {(running || finished) && (
        <div className="mt-5">
          <div className="h-2 w-full overflow-hidden rounded-full bg-cloud">
            <div className="h-full rounded-full bg-brand transition-all duration-300" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-2 text-sm text-ink-soft">
            {running
              ? `Optimizing ${progress.done} / ${progress.total}…`
              : `Done — optimized ${progress.optimized} of ${progress.total} image${progress.total === 1 ? "" : "s"}`}
            {progress.savedKB > 0 && ` · saved ${(progress.savedKB / 1024).toFixed(1)} MB`}
          </p>
        </div>
      )}

      <button
        onClick={run}
        disabled={running}
        className="btn btn-primary mt-5 w-full px-5 py-3 text-sm disabled:opacity-60"
      >
        {running ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Optimizing…
          </>
        ) : finished ? (
          <>
            <Check className="size-4" /> Run again
          </>
        ) : (
          <>
            <Sparkles className="size-4" /> Optimize all menu images
          </>
        )}
      </button>
      <p className="mt-2 text-center text-xs text-muted">
        Safe to run anytime — already-small images are skipped. Changes may take a minute to appear on
        the live site.
      </p>
    </div>
  );
}
