import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getRestaurant } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { InstagramIcon, FacebookIcon, WhatsappIcon } from "@/components/ui/BrandIcons";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Snow Spoon — call, email, WhatsApp or visit us. Find our address, hours and social links.",
};

export const revalidate = 60;

export default async function ContactPage() {
  const restaurant = await getRestaurant();
  const phone = restaurant?.phone ?? "";
  const email = restaurant?.email ?? "";
  const address = restaurant?.address ?? "";
  const socials = restaurant?.socials ?? {};
  const hours = restaurant?.hours ?? [];
  const waNumber = phone.replace(/[^0-9]/g, "");
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address || "Snow Spoon Bengaluru")}&output=embed`;

  return (
    <>
      <PageHeader
        eyebrow="💬 Say hello"
        title="Get in touch"
        subtitle="Questions, feedback or just craving something sweet? We'd love to hear from you."
      />

      <section className="container-page pb-10">
        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          {/* Left: contact info */}
          <div className="space-y-4">
            <Reveal>
              <div className="card grid gap-3 rounded-3xl p-6 sm:grid-cols-2">
                <ContactTile icon={<Phone className="size-5" />} label="Call us" value={phone} href={`tel:${phone}`} />
                <ContactTile icon={<Mail className="size-5" />} label="Email" value={email} href={`mailto:${email}`} />
                {waNumber && (
                  <ContactTile
                    icon={<WhatsappIcon className="size-5" />}
                    label="WhatsApp"
                    value="Chat with us"
                    href={`https://wa.me/${waNumber}`}
                    external
                  />
                )}
                {socials.instagram && (
                  <ContactTile
                    icon={<InstagramIcon className="size-5" />}
                    label="Instagram"
                    value="Follow us"
                    href={socials.instagram}
                    external
                  />
                )}
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="card rounded-3xl p-6">
                <div className="flex items-center gap-2 text-ink">
                  <MapPin className="size-5 text-brand" />
                  <h3 className="font-display text-base font-bold">Visit us</h3>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{address}</p>
              </div>
            </Reveal>

            {hours.length > 0 && (
              <Reveal delay={0.12}>
                <div className="card rounded-3xl p-6">
                  <div className="flex items-center gap-2 text-ink">
                    <Clock className="size-5 text-brand" />
                    <h3 className="font-display text-base font-bold">Opening hours</h3>
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

            {(socials.instagram || socials.facebook) && (
              <Reveal delay={0.16}>
                <div className="flex gap-2.5">
                  {socials.instagram && (
                    <SocialButton href={socials.instagram}><InstagramIcon className="size-5" /></SocialButton>
                  )}
                  {socials.facebook && (
                    <SocialButton href={socials.facebook}><FacebookIcon className="size-5" /></SocialButton>
                  )}
                  {waNumber && (
                    <SocialButton href={`https://wa.me/${waNumber}`}><WhatsappIcon className="size-5" /></SocialButton>
                  )}
                </div>
              </Reveal>
            )}
          </div>

          {/* Right: map */}
          <Reveal delay={0.1}>
            <div className="card h-full min-h-[420px] overflow-hidden rounded-3xl p-1.5">
              <iframe
                title="Snow Spoon location"
                src={mapSrc}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[410px] w-full rounded-[1.35rem]"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function ContactTile({
  icon,
  label,
  value,
  href,
  external,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-3 rounded-2xl border border-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-brand-tint hover:shadow-soft"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand transition-colors group-hover:bg-brand group-hover:text-white">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
        <span className="block truncate text-sm font-semibold text-ink">{value}</span>
      </span>
    </a>
  );
}

function SocialButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="grid size-11 place-items-center rounded-full border border-line bg-white text-ink-soft shadow-soft transition-all hover:-translate-y-0.5 hover:border-brand-tint hover:text-brand"
    >
      {children}
    </a>
  );
}
