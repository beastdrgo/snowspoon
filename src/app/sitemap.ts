import type { MetadataRoute } from "next";

const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/menu", "/about", "/gallery", "/locations", "/contact"];
  const now = new Date();
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/menu" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/menu" ? 0.9 : 0.6,
  }));
}
