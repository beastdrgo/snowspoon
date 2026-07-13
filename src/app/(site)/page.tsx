import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Snowflake, ShieldCheck, Heart } from "lucide-react";
import { getCategories, getGallery, getMenuItems, getRestaurant } from "@/lib/queries";
import { Hero } from "@/components/site/Hero";
import { AmbienceSlideshow } from "@/components/site/AmbienceSlideshow";
import { FeaturedMenu } from "@/components/menu/FeaturedMenu";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 60;

const WHY = [
  { icon: Leaf, title: "Premium Ingredients", text: "Real fruit, rich dairy and the finest cocoa — nothing artificial." },
  { icon: Snowflake, title: "Made Fresh Daily", text: "Every scoop and shake is churned fresh, never sitting around." },
  { icon: ShieldCheck, title: "Hygienic & Safe", text: "Spotless kitchens and strict hygiene, so you can indulge worry-free." },
  { icon: Heart, title: "Made with Love", text: "Crafted by people who genuinely love making you smile." },
];

export default async function HomePage() {
  const [restaurant, categories, items, gallery] = await Promise.all([
    getRestaurant(),
    getCategories(),
    getMenuItems(),
    getGallery(),
  ]);

  const popular = items.filter((i) => i.popular && i.available).slice(0, 8);
  const featured = (popular.length >= 4 ? popular : items.slice(0, 8)).slice(0, 8);

  return (
    <>
      <Hero restaurant={restaurant} />

      {/* Explore menu CTA */}
      <section className="container-page py-10">
        <Reveal>
          <div className="card flex flex-col items-center gap-4 rounded-[2rem] px-6 py-12 text-center sm:py-14">
            <span className="chip bg-brand-soft text-brand">🍨 Our full menu</span>
            <h2 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              Explore our full menu
            </h2>
            <p className="max-w-md text-ink-soft">
              {categories.length > 0
                ? `${categories.slice(0, 4).map((c) => c.short ?? c.label).join(", ")} & more`
                : "Sundaes, shakes, desserts, burgers & more"}{" "}
              — all made fresh, made for you.
            </p>
            <Link href="/menu" className="btn btn-primary mt-2 px-8 py-3.5 text-base">
              Explore Menu <ArrowRight className="size-4.5" />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* Popular picks */}
      <section className="container-page py-10">
        <Reveal className="mb-7 flex items-end justify-between">
          <div>
            <span className="chip bg-brand-soft text-brand">🔥 Crowd favourites</span>
            <h2 className="heading-underline mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
              Popular right now
            </h2>
          </div>
          <Link
            href="/menu"
            className="hidden items-center gap-1 text-sm font-semibold text-brand hover:gap-2 sm:inline-flex"
          >
            Full menu <ArrowRight className="size-4" />
          </Link>
        </Reveal>

        <FeaturedMenu items={featured} />
      </section>

      {/* Why Snow Spoon */}
      <section className="py-14">
        <div className="container-page">
          <Reveal className="mx-auto max-w-xl text-center">
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              Why <span className="text-gradient">Snow Spoon</span>
            </h2>
            <p className="mt-3 text-ink-soft">
              We sweat the small stuff so every bite feels special.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="card h-full rounded-3xl p-6 transition-shadow hover:shadow-lift">
                  <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                    <Icon className="size-6" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Ambience */}
      <section className="container-page py-12">
        <Reveal className="mx-auto mb-8 max-w-xl text-center">
          <span className="chip bg-blue-soft text-blue">📍 Our space</span>
          <h2 className="mt-3 font-display text-2xl font-bold text-ink sm:text-3xl">
            Step inside <span className="text-gradient">Snow Spoon</span>
          </h2>
          <p className="mt-3 text-ink-soft">
            A splash of colour, comfy corners and a whole lot of sweetness — come hang out.
          </p>
        </Reveal>
        <Reveal>
          <AmbienceSlideshow />
        </Reveal>
      </section>

      {/* Gallery teaser */}
      {gallery.length > 0 && (
        <section className="container-page py-10">
          <Reveal className="mb-6 flex items-end justify-between">
            <h2 className="heading-underline font-display text-2xl font-bold text-ink sm:text-3xl">
              From our kitchen
            </h2>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:gap-2"
            >
              See gallery <ArrowRight className="size-4" />
            </Link>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {gallery.slice(0, 6).map((g, i) => (
              <Reveal key={g.id} delay={i * 0.05}>
                <Link
                  href="/gallery"
                  className={`group relative block overflow-hidden rounded-2xl shadow-soft ${
                    i === 0 ? "col-span-2 row-span-2 aspect-square sm:col-span-1 sm:row-span-1" : "aspect-square"
                  }`}
                >
                  <Image
                    src={g.image_url}
                    alt={g.title ?? "Snow Spoon dessert"}
                    fill
                    sizes="(max-width: 640px) 45vw, 200px"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="container-page py-14">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brand to-[#ff5c7d] px-8 py-14 text-center shadow-glow sm:px-16">
            <div className="pointer-events-none absolute -right-10 -top-10 size-52 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-10 size-56 rounded-full bg-white/10 blur-2xl" />
            <h2 className="font-display text-3xl font-extrabold text-white sm:text-4xl">
              Ready for your happy place?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-white/90">
              Browse the full Snow Spoon menu and find your next favourite dessert.
            </p>
            <Link
              href="/menu"
              className="btn mt-7 bg-white px-8 py-3.5 text-base font-bold text-brand hover:-translate-y-0.5 hover:shadow-lift"
            >
              View the Menu <ArrowRight className="size-4.5" />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
