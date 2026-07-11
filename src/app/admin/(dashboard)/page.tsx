import Link from "next/link";
import Image from "next/image";
import {
  UtensilsCrossed,
  FolderTree,
  CheckCircle2,
  EyeOff,
  Images,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [catsRes, itemsRes, galleryRes, recentRes] = await Promise.all([
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("menu_items").select("available, updated_at"),
    supabase.from("gallery").select("id", { count: "exact", head: true }),
    supabase
      .from("menu_items")
      .select("id, name, price, available, image_url, updated_at")
      .order("updated_at", { ascending: false })
      .limit(6),
  ]);

  const items = itemsRes.data ?? [];
  const totalItems = items.length;
  const available = items.filter((i) => i.available).length;
  const unavailable = totalItems - available;
  const totalCats = catsRes.count ?? 0;
  const totalGallery = galleryRes.count ?? 0;
  const lastUpdated = items.reduce<string | null>(
    (acc, i) => (!acc || i.updated_at > acc ? i.updated_at : acc),
    null
  );
  const recent = recentRes.data ?? [];

  const stats = [
    { label: "Menu Items", value: totalItems, icon: UtensilsCrossed, tint: "bg-brand-soft text-brand", href: "/admin/menu" },
    { label: "Categories", value: totalCats, icon: FolderTree, tint: "bg-blue-soft text-blue", href: "/admin/categories" },
    { label: "Available", value: available, icon: CheckCircle2, tint: "bg-green-50 text-green-600", href: "/admin/menu" },
    { label: "Hidden / Sold out", value: unavailable, icon: EyeOff, tint: "bg-amber-50 text-amber-600", href: "/admin/menu" },
    { label: "Gallery Images", value: totalGallery, icon: Images, tint: "bg-violet-50 text-violet-600", href: "/admin/gallery" },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {lastUpdated ? `Menu last updated ${timeAgo(lastUpdated)}.` : "Welcome back."}
          </p>
        </div>
        <Link href="/admin/menu" className="btn btn-primary px-5 py-2.5 text-sm">
          <Plus className="size-4.5" /> Add menu item
        </Link>
      </div>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {stats.map(({ label, value, icon: Icon, tint, href }) => (
          <Link
            key={label}
            href={href}
            className="card group rounded-3xl p-5 transition-shadow hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <span className={`grid size-11 place-items-center rounded-2xl ${tint}`}>
                <Icon className="size-5" />
              </span>
              <ArrowUpRight className="size-4 text-muted transition-colors group-hover:text-brand" />
            </div>
            <p className="mt-4 font-display text-3xl font-bold text-ink">{value}</p>
            <p className="text-sm text-ink-soft">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent changes */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="card rounded-3xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-ink">Recently updated</h2>
            <Link href="/admin/menu" className="text-sm font-semibold text-brand hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line">
            {recent.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <span className="relative size-11 shrink-0 overflow-hidden rounded-xl bg-cloud">
                  {item.image_url && (
                    <Image src={item.image_url} alt={item.name} fill sizes="44px" className="object-cover" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{item.name}</p>
                  <p className="text-xs text-muted">Updated {timeAgo(item.updated_at)}</p>
                </div>
                <span className="text-sm font-bold text-brand">{formatPrice(item.price)}</span>
                <span
                  className={`chip ${
                    item.available ? "bg-green-50 text-green-700" : "bg-cloud text-muted"
                  }`}
                >
                  {item.available ? "Live" : "Hidden"}
                </span>
              </li>
            ))}
            {recent.length === 0 && (
              <li className="py-8 text-center text-sm text-muted">No items yet.</li>
            )}
          </ul>
        </div>

        {/* Quick actions */}
        <div className="card rounded-3xl p-6">
          <h2 className="font-display text-lg font-bold text-ink">Quick actions</h2>
          <div className="mt-4 space-y-2">
            {[
              { label: "Add a menu item", href: "/admin/menu" },
              { label: "Manage categories", href: "/admin/categories" },
              { label: "Update gallery", href: "/admin/gallery" },
              { label: "Edit restaurant info", href: "/admin/settings" },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="flex items-center justify-between rounded-2xl border border-line px-4 py-3 text-sm font-semibold text-ink-soft transition-colors hover:border-brand-tint hover:text-brand"
              >
                {a.label}
                <ArrowUpRight className="size-4" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
