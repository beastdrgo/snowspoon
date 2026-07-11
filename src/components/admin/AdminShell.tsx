"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  FolderTree,
  Images,
  Settings,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/menu", label: "Menu Items", icon: UtensilsCrossed },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/gallery", label: "Gallery", icon: Images },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-5 py-5">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Snow Spoon" width={130} height={44} className="h-9 w-auto" />
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-cloud lg:hidden"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`relative flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                active ? "text-brand" : "text-ink-soft hover:bg-cloud hover:text-ink"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="admin-active"
                  className="absolute inset-0 -z-10 rounded-2xl bg-brand-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 34 }}
                />
              )}
              <Icon className="size-5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-line p-3">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink-soft hover:bg-cloud"
        >
          <ExternalLink className="size-5" /> View website
        </Link>
        <div className="mt-2 flex items-center gap-3 rounded-2xl bg-cloud px-4 py-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">
            {email.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-ink">{email}</p>
            <p className="text-[11px] text-muted">Administrator</p>
          </div>
          <button
            onClick={logout}
            aria-label="Sign out"
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted hover:bg-white hover:text-brand"
          >
            <LogOut className="size-4.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="lg:grid lg:grid-cols-[264px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen border-r border-line bg-white lg:block">
        {SidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="grid size-10 place-items-center rounded-full border border-line text-ink"
        >
          <MenuIcon className="size-5" />
        </button>
        <Image src="/logo.png" alt="Snow Spoon" width={120} height={40} className="h-8 w-auto" />
        <span className="size-10" />
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
            <motion.aside
              className="absolute inset-y-0 left-0 w-72 bg-white shadow-lift"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              {SidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
