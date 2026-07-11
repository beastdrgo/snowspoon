"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ShieldCheck } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Contact" },
  { href: "/review", label: "Review" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass border-b border-line/70 shadow-[0_6px_24px_-18px_rgba(23,19,38,0.5)]" : ""
        }`}
      >
        <nav className="container-page flex h-18 items-center justify-between gap-4 py-3">
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Snow Spoon home">
            <Image
              src="/logo.png"
              alt="Snow Spoon"
              width={132}
              height={44}
              priority
              className="h-9 w-auto md:h-10"
            />
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-1 lg:flex">
            {LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      active ? "text-brand" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-brand"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/login"
              className="hidden items-center gap-1.5 rounded-full border border-line bg-white/70 px-3.5 py-2 text-sm font-semibold text-ink-soft shadow-soft transition-colors hover:text-brand sm:inline-flex"
            >
              <ShieldCheck className="size-4" />
              Admin
            </Link>
            <Link href="/menu" className="btn btn-primary hidden px-5 py-2.5 text-sm sm:inline-flex">
              View Menu
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid size-11 place-items-center rounded-full border border-line bg-white/70 text-ink shadow-soft lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              className="absolute inset-x-3 top-20 rounded-3xl border border-line bg-white p-3 shadow-lift"
              initial={{ opacity: 0, y: -16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <ul className="flex flex-col">
                {LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <Link
                      href={link.href}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold ${
                        isActive(link.href)
                          ? "bg-brand-soft text-brand"
                          : "text-ink hover:bg-cloud"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-2 grid grid-cols-2 gap-2 p-1">
                <Link href="/admin/login" className="btn btn-ghost py-3 text-sm">
                  <ShieldCheck className="size-4" /> Admin
                </Link>
                <Link href="/menu" className="btn btn-primary py-3 text-sm">
                  View Menu
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
