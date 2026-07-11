import type { Restaurant } from "@/lib/types";

/** Restaurant schema.org JSON-LD for rich search results. */
export function StructuredData({ restaurant }: { restaurant: Restaurant | null }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant?.name ?? "Snow Spoon",
    description: restaurant?.description ?? undefined,
    servesCuisine: ["Desserts", "Ice Cream", "Milkshakes"],
    priceRange: "₹₹",
    url: base,
    telephone: restaurant?.phone ?? undefined,
    email: restaurant?.email ?? undefined,
    image: `${base}/images/dessert-platter.jpeg`,
    address: restaurant?.address
      ? { "@type": "PostalAddress", streetAddress: restaurant.address }
      : undefined,
    openingHours: (restaurant?.hours ?? []).map((h) => `${h.day} ${h.time}`),
    sameAs: Object.values(restaurant?.socials ?? {}).filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
