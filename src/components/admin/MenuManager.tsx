"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Pencil,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Flame,
  Sparkles,
  GripVertical,
} from "lucide-react";
import type { Category, MenuItemRow } from "@/lib/types";
import {
  fetchCategories,
  fetchMenuItems,
  deleteMenuItems,
  toggleMenuAvailability,
  saveMenuItem,
  reorderMenuItems,
} from "@/lib/admin/api";
import { formatPrice } from "@/lib/format";
import { MenuItemForm } from "./MenuItemForm";
import { ConfirmDialog } from "./ConfirmDialog";
import { toast } from "./Toast";

type FormItem = Partial<MenuItemRow> & { id?: string };

export function MenuManager() {
  const qc = useQueryClient();
  const { data: items = [], isLoading } = useQuery({ queryKey: ["admin-menu"], queryFn: fetchMenuItems });
  const { data: categories = [] } = useQuery({ queryKey: ["admin-categories"], queryFn: fetchCategories });

  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editing, setEditing] = useState<FormItem | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirm, setConfirm] = useState<{ ids: string[]; label: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // Local, drag-reorderable copy of the items (kept in sync with the query).
  const [rows, setRows] = useState<MenuItemRow[]>([]);
  // Include updated_at so availability toggles / edits re-sync too (every
  // mutation bumps updated_at). Signature is a stable string, so it never loops.
  const itemsSig = items.map((i) => `${i.id}:${i.sort_order}:${i.updated_at}`).join("|");
  useEffect(() => {
    setRows(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsSig]);

  // Drag-and-drop state.
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const catMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c])) as Record<string, Category>,
    [categories]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((it) => {
      if (categoryFilter !== "all" && it.category_id !== categoryFilter) return false;
      if (q && !`${it.name} ${it.slug}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [rows, query, categoryFilter]);

  // Dragging only makes sense on the full, unfiltered, unsearched list.
  const dragEnabled = query.trim() === "" && categoryFilter === "all";

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin-menu"] });

  function toggleSelect(id: string) {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleAll() {
    setSelected((s) => (s.size === filtered.length ? new Set() : new Set(filtered.map((i) => i.id))));
  }

  async function handleToggle(item: MenuItemRow) {
    await toggleMenuAvailability(item.id, !item.available);
    toast(item.available ? "Item hidden." : "Item is now live.");
    refresh();
  }

  async function handleDuplicate(item: MenuItemRow) {
    const { id, created_at, updated_at, ...rest } = item;
    void id; void created_at; void updated_at;
    await saveMenuItem({
      ...rest,
      name: `${item.name} (copy)`,
      slug: `${item.slug}-copy-${Date.now().toString(36)}`,
      popular: false,
    });
    toast("Item duplicated.");
    refresh();
  }

  async function runDelete() {
    if (!confirm) return;
    setBusy(true);
    try {
      await deleteMenuItems(confirm.ids);
      toast(`Deleted ${confirm.ids.length} item${confirm.ids.length > 1 ? "s" : ""}.`);
      setSelected(new Set());
      refresh();
    } catch (e) {
      toast(e instanceof Error ? e.message : "Delete failed.", "error");
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  }

  // Persist a reordered list (only rows whose position changed).
  async function persistOrder(list: MenuItemRow[]) {
    const payload = list
      .map((it, i) => ({ id: it.id, sort_order: i }))
      .filter((p, i) => list[i].sort_order !== p.sort_order);
    if (payload.length === 0) return;
    try {
      await reorderMenuItems(payload);
      toast("Order updated.");
    } catch (e) {
      toast(e instanceof Error ? e.message : "Couldn't save order.", "error");
      refresh();
    }
  }

  function handleDrop(targetId: string, sourceIdFromEvent?: string) {
    const sourceId = sourceIdFromEvent || dragId;
    setDragId(null);
    setOverId(null);
    if (!sourceId || sourceId === targetId) return;
    const from = rows.findIndex((r) => r.id === sourceId);
    const to = rows.findIndex((r) => r.id === targetId);
    if (from < 0 || to < 0) return;
    const next = [...rows];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    // Normalise sort_order locally so future drags diff correctly.
    const normalised = next.map((it, i) => ({ ...it, sort_order: i }));
    setRows(normalised);
    void persistOrder(next);
  }

  function renderCells(item: MenuItemRow) {
    return (
      <>
        <td className="px-4 py-3">
          <input
            type="checkbox"
            checked={selected.has(item.id)}
            onChange={() => toggleSelect(item.id)}
            className="size-4 accent-[var(--color-brand)]"
          />
        </td>
        <td className="px-2 py-3">
          <div className="flex items-center gap-3">
            <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-cloud">
              {item.image_url && (
                <Image src={item.image_url} alt={item.name} fill sizes="44px" className="object-cover" />
              )}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 font-semibold text-ink">
                <span className="truncate">{item.name}</span>
                {item.popular && <Flame className="size-3.5 shrink-0 text-brand" />}
                {item.is_new && <Sparkles className="size-3.5 shrink-0 text-blue" />}
              </p>
              <p className="truncate text-xs text-muted">{item.slug}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-ink-soft">{catMap[item.category_id ?? ""]?.label ?? "—"}</td>
        <td className="px-4 py-3 font-semibold text-ink">{formatPrice(item.price)}</td>
        <td className="px-4 py-3">
          <span className={`chip ${item.available ? "bg-green-50 text-green-700" : "bg-cloud text-muted"}`}>
            {item.available ? "Live" : "Hidden"}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center justify-end gap-1">
            <IconBtn title={item.available ? "Hide" : "Show"} onClick={() => handleToggle(item)}>
              {item.available ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </IconBtn>
            <IconBtn title="Duplicate" onClick={() => handleDuplicate(item)}>
              <Copy className="size-4" />
            </IconBtn>
            <IconBtn title="Edit" onClick={() => setEditing(item)}>
              <Pencil className="size-4" />
            </IconBtn>
            <IconBtn title="Delete" danger onClick={() => setConfirm({ ids: [item.id], label: item.name })}>
              <Trash2 className="size-4" />
            </IconBtn>
          </div>
        </td>
      </>
    );
  }

  const list = dragEnabled ? rows : filtered;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Menu Items</h1>
          <p className="mt-1 text-sm text-ink-soft">{items.length} items across {categories.length} categories.</p>
        </div>
        <button onClick={() => setEditing({})} className="btn btn-primary px-5 py-2.5 text-sm">
          <Plus className="size-4.5" /> Add item
        </button>
      </div>

      {/* Toolbar */}
      <div className="card mt-5 flex flex-col gap-3 rounded-3xl p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items…"
            className="w-full rounded-full border border-line bg-white py-2.5 pl-11 pr-4 text-sm outline-none focus:border-brand-tint"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-full border border-line bg-white px-4 py-2.5 text-sm font-medium outline-none focus:border-brand-tint"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      </div>

      {/* Reorder hint */}
      {!isLoading && list.length > 0 && (
        <p className="mt-3 flex items-center gap-1.5 px-1 text-xs text-muted">
          <GripVertical className="size-3.5" />
          {dragEnabled
            ? "Drag any row by its handle to reorder — this sets the order shown on your site. Saves automatically."
            : "Clear the search and category filter to drag-reorder items."}
        </p>
      )}

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-brand-soft px-4 py-2.5 text-sm">
          <span className="font-semibold text-brand">{selected.size} selected</span>
          <button
            onClick={() => setConfirm({ ids: [...selected], label: `${selected.size} items` })}
            className="inline-flex items-center gap-1.5 font-semibold text-red-600 hover:underline"
          >
            <Trash2 className="size-4" /> Delete selected
          </button>
        </div>
      )}

      {/* Table */}
      <div className="card mt-4 overflow-hidden rounded-3xl">
        {isLoading ? (
          <div className="grid place-items-center py-20">
            <Loader2 className="size-6 animate-spin text-brand" />
          </div>
        ) : list.length === 0 ? (
          <p className="py-20 text-center text-sm text-muted">No items match your search.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-line bg-cloud text-xs uppercase tracking-wide text-muted">
                <tr>
                  {dragEnabled && <th className="w-8 pl-3" aria-label="Drag" />}
                  <th className="w-10 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.size === list.length && list.length > 0}
                      onChange={toggleAll}
                      className="size-4 accent-[var(--color-brand)]"
                    />
                  </th>
                  <th className="px-2 py-3">Item</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.map((item) => {
                  const isDragging = dragId === item.id;
                  const isOver = overId === item.id && dragId !== item.id;
                  return (
                    <tr
                      key={item.id}
                      onDragOver={dragEnabled ? (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; } : undefined}
                      onDragEnter={dragEnabled ? () => setOverId(item.id) : undefined}
                      onDrop={dragEnabled ? (e) => { e.preventDefault(); handleDrop(item.id, e.dataTransfer.getData("text/plain")); } : undefined}
                      className={`transition-colors hover:bg-cloud/60 ${isDragging ? "opacity-40" : ""} ${
                        isOver ? "outline outline-2 -outline-offset-2 outline-brand-tint" : ""
                      }`}
                    >
                      {dragEnabled && (
                        <td className="py-3 pl-3 pr-1">
                          <button
                            type="button"
                            draggable
                            onDragStart={(e) => {
                              setDragId(item.id);
                              e.dataTransfer.effectAllowed = "move";
                              e.dataTransfer.setData("text/plain", item.id);
                            }}
                            onDragEnd={() => { setDragId(null); setOverId(null); }}
                            title="Drag to reorder"
                            aria-label="Drag to reorder"
                            className="grid size-8 cursor-grab touch-none place-items-center rounded-lg text-muted transition-colors hover:bg-cloud hover:text-ink active:cursor-grabbing"
                          >
                            <GripVertical className="size-4" />
                          </button>
                        </td>
                      )}
                      {renderCells(item)}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <MenuItemForm
        item={editing}
        categories={categories}
        onClose={() => setEditing(null)}
        onSaved={refresh}
      />

      <ConfirmDialog
        open={confirm !== null}
        title="Delete item"
        message={`Delete "${confirm?.label}"? This cannot be undone.`}
        confirmLabel="Delete"
        busy={busy}
        onCancelAction={() => setConfirm(null)}
        onConfirmAction={runDelete}
      />
    </div>
  );
}

function IconBtn({
  children,
  title,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  title: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-full text-ink-soft transition-colors hover:bg-cloud ${
        danger ? "hover:text-red-600" : "hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}
