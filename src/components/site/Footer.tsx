import Link from "next/link";
import Image from "next/image";
import { Leaf, Snowflake, ShieldCheck, Heart, MapPin, Phone, Mail } from "lucide-react";
import { InstagramIcon, FacebookIcon, XIcon } from "@/components/ui/BrandIcons";
import type { Restaurant } from "@/lib/types";

const FEATURES = [
  { icon: Leaf, label: "Premium Ingredients", tint: "text-green-600 bg-green-50" },
  { icon: Snowflake, label: "Made Fresh Daily", tint: "text-blue bg-blue-soft" },
  { icon: ShieldCheck, label: "Hygienic & Safe", tint: "text-violet-600 bg-violet-50" },
  { icon: Heart, label: "Made with Love", tint: "text-brand bg-brand-soft" },
];

export function Footer({ restaurant }: { restaurant: Restaurant | null }) {
  const name = restaurant?.name ?? "Snow Spoon";
  const socials = restaurant?.socials ?? {};
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24">
      {/* Feature strip */}
      <div className="container-page">
        <div className="card grid grid-cols-2 gap-4 rounded-3xl px-5 py-6 sm:px-8 md:grid-cols-4">
          {FEATURES.map(({ icon: Icon, label, tint }) => (
            <div key={label} className="flex items-center gap-3">
              <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${tint}`}>
                <Icon className="size-5" />
              </span>
              <span className="text-sm font-semibold leading-tight text-ink">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="mt-14 border-t border-line bg-white/60">
        <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Image src="/logo.png" alt={name} width={150} height={50} className="h-11 w-auto" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-soft">
              {restaurant?.description ??
                "Scoops of joy in every bite. Premium sundaes, thick shakes, kulfi and desserts, made fresh and served with love."}
            </p>
            <div className="mt-5 flex gap-2.5">
              {socials.instagram && (
                <SocialIcon href={socials.instagram} label="Instagram">
                  <InstagramIcon className="size-4.5" />
                </SocialIcon>
              )}
              {socials.facebook && (
                <SocialIcon href={socials.facebook} label="Facebook">
                  <FacebookIcon className="size-4.5" />
                </SocialIcon>
              )}
              {socials.twitter && (
                <SocialIcon href={socials.twitter} label="Twitter">
                  <XIcon className="size-4" />
                </SocialIcon>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-ink">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-ink-soft">
              {[
                ["Menu", "/menu"],
                ["About Us", "/about"],
                ["Gallery", "/gallery"],
                ["Locations", "/locations"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="transition-colors hover:text-brand">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wide text-ink">Get in touch</h4>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              {restaurant?.address && (
                <li className="flex gap-2.5">
                  <MapPin className="mt-0.5 size-4.5 shrink-0 text-brand" />
                  <span>{restaurant.address}</span>
                </li>
              )}
              {restaurant?.phone && (
                <li className="flex gap-2.5">
                  <Phone className="mt-0.5 size-4.5 shrink-0 text-brand" />
                  <a href={`tel:${restaurant.phone}`} className="hover:text-brand">
                    {restaurant.phone}
                  </a>
                </li>
              )}
              {restaurant?.email && (
                <li className="flex gap-2.5">
                  <Mail className="mt-0.5 size-4.5 shrink-0 text-brand" />
                  <a href={`mailto:${restaurant.email}`} className="hover:text-brand">
                    {restaurant.email}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-line">
          <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted sm:flex-row">
            <p>
              © {year} {name}. All rights reserved.
            </p>
            <div className="flex flex-col items-center gap-1 sm:flex-row sm:gap-4">
              <p className="flex items-center gap-1">
                Crafted with <Heart className="inline size-3.5 text-brand" /> for dessert lovers.
              </p>
              <p className="flex items-center gap-1.5">
                Developed by
                <a
                  href="https://growplus.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-brand transition-colors hover:text-brand-700"
                >
                  Grow+
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-line bg-white text-ink-soft shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-tint hover:text-brand"
    >
      {children}
    </a>
  );
}
