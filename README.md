# 🍨 Snow Spoon — Premium Digital Menu

A production-ready, premium digital menu website for Snow Spoon, built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, Framer Motion, React Query, Zustand and Supabase.

This is a **digital menu** (not e-commerce) — no cart, checkout or ordering. The entire menu and site content is managed through a secure, Supabase-powered admin dashboard.

## ✨ Features

**Public site**
- Animated hero, category explorer, popular picks, "why us", gallery teaser
- Menu page inspired by the reference: left sidebar categories, scrollable pills, live search, filters (veg / available), sort (featured / newest / price / A–Z), product detail modal
- Gallery with lightbox, About, Contact (map + hours + socials), Locations (per-branch maps)
- Fully responsive, glassmorphism, soft shadows, smooth Framer Motion animations
- SEO: dynamic metadata, Open Graph, Twitter cards, `sitemap.xml`, `robots.txt`, Restaurant JSON-LD

**Admin dashboard** (`/admin`)
- Supabase email/password auth, protected routes (middleware), forgot-password
- Dashboard analytics (item / category / availability / gallery counts, recent changes)
- Menu management: add / edit / delete / duplicate / hide-show / bulk delete / search / image upload
- Category, gallery and full restaurant-settings management (hero, contact, hours, socials, branches)

## 🚀 Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase values
npm run dev
```

Open http://localhost:3000

### Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable / anon key |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for SEO / sitemap) |

## 🗄️ Backend (Supabase)

The database is already provisioned with these tables (RLS enabled — public read, authenticated write):

- `categories`, `menu_items`, `gallery`, `restaurant_info`
- Storage bucket `menu-images` (public read, authenticated upload) for admin-uploaded images

Seed images referenced by `/images/*.jpeg` live in `public/images/`. New images uploaded via the
admin panel are stored in Supabase Storage and served from there.

**Admin login:** `admin@snowspoon.in` (password set in Supabase Auth).

## 🏗️ Build & deploy

```bash
npm run build
npm start
```

Deploy to Vercel (recommended): import the repo, add the three environment variables, and deploy.
`fntbogtkcmlaqcpdevdc.supabase.co` is already whitelisted for `next/image` in `next.config.ts` —
update the hostname there if you point at a different Supabase project.

## 🧱 Tech

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion · lucide-react ·
TanStack React Query · Zustand · Supabase (Postgres + Storage + Auth).
