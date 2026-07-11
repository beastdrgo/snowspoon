import type { Metadata } from "next";
import { MapPin, Phone, Navigation, Clock } from "lucide-react";
import { getRestaurant } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Locations",
  description: "Find your nearest Snow Spoon outlet. Addresses, phone numbers and directions for every branch.",
};

export const revalidate = 60;

export default async function LocationsPage() {
  const restaurant = await getRestaurant();
  const branches =
    restaurant?.branches && restaurant.branches.length > 0
      ? restaurant.branches
      : restaurant?.address
        ? [{ name: restaurant.name, phone: restaurant.phone ?? "", address: restaurant.address }]
        : [];
  const hours = restaurant?.hours ?? [];

  return (
    <>
      <PageHeader
        eyebrow="📍 Find us"
        title="Our locations"
        subtitle="Drop by your nearest Snow Spoon — the same joy at every outlet."
      />

      <section className="container-page pb-10">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((b, i) => {
            const q = encodeURIComponent(b.map || b.address || b.name);
            return (
              <Reveal key={`${b.name}-${i}`} delay={i * 0.06}>
                <div className="card flex h-full flex-col overflow-hidden rounded-3xl">
                  <div className="relative h-36 w-full">
                    <iframe
                      title={`${b.name} map`}
                      src={`https://www.google.com/maps?q=${q}&output=embed`}
                      loading="lazy"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-bold text-ink">{b.name}</h3>
                    {b.address && (
                      <p className="mt-2 flex gap-2 text-sm leading-relaxed text-ink-soft">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-brand" />
                        {b.address}
                      </p>
                    )}
                    {b.phone && (
                      <a
                        href={`tel:${b.phone}`}
                        className="mt-2 flex items-center gap-2 text-sm font-medium text-ink-soft hover:text-brand"
                      >
                        <Phone className="size-4 shrink-0 text-brand" />
                        {b.phone}
                      </a>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${q}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost mt-auto pt-2.5 pb-2.5 text-sm"
                    >
                      <Navigation className="size-4" /> Get directions
                    </a>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {hours.length > 0 && (
          <Reveal className="mt-8">
            <div className="card mx-auto max-w-lg rounded-3xl p-6">
              <div className="flex items-center gap-2 text-ink">
                <Clock className="size-5 text-brand" />
                <h3 className="font-display text-base font-bold">Opening hours (all outlets)</h3>
              </div>
              <ul className="mt-3 space-y-2">
                {hours.map((h) => (
                  <li key={h.day} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{h.day}</span>
                    <span className="text-ink-soft">{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </section>
    </>
  );
}
