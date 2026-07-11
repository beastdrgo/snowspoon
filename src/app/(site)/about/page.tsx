import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target, Eye, Sparkles, Leaf, Snowflake, ShieldCheck, Heart } from "lucide-react";
import { getRestaurant } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "The Snow Spoon story — premium desserts made fresh with love. Learn about our vision, mission and what makes us different.",
};

export const revalidate = 60;

const VALUES = [
  { icon: Leaf, title: "Premium Ingredients", text: "Only the finest dairy, real fruit and rich cocoa." },
  { icon: Snowflake, title: "Made Fresh Daily", text: "Churned and plated fresh, every single day." },
  { icon: ShieldCheck, title: "Hygienic & Safe", text: "Spotless kitchens with strict hygiene standards." },
  { icon: Heart, title: "Made with Love", text: "Crafted by people who love making you smile." },
];

export default async function AboutPage() {
  const restaurant = await getRestaurant();
  const name = restaurant?.name ?? "Snow Spoon";

  return (
    <>
      <PageHeader
        eyebrow="🍨 Our story"
        title="Sweetness, perfected"
        subtitle={restaurant?.tagline ?? "Scoops of joy in every bite."}
      />

      {/* Story */}
      <section className="container-page py-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border-8 border-white shadow-lift">
              <Image
                src="/images/dessert-platter.jpeg"
                alt="Snow Spoon desserts"
                fill
                sizes="(max-width: 768px) 90vw, 500px"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="font-display text-3xl font-bold text-ink">
              Where every dessert tells a story
            </h2>
            <p className="mt-4 leading-relaxed text-ink-soft">
              {restaurant?.description ??
                `${name} serves premium sundaes, thick shakes, kulfi and desserts — freshly prepared with premium ingredients and served with love.`}
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              What began as a small dream has grown into a place people return to for their
              favourite treats. We obsess over quality, texture and that first spoonful of joy —
              because dessert should always feel special.
            </p>
            <Link href="/menu" className="btn btn-primary mt-6 px-6 py-3 text-sm">
              Explore the Menu <ArrowRight className="size-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="container-page py-10">
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { icon: Eye, title: "Our Vision", text: "To be the most-loved dessert destination — the first name that comes to mind when someone craves something sweet and special." },
            { icon: Target, title: "Our Mission", text: "To craft joyful, high-quality desserts using premium ingredients, served fresh with warmth and consistency, every single time." },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="card h-full rounded-3xl p-8">
                <span className="grid size-12 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-ink">{title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Why choose us */}
      <section className="container-page py-10">
        <Reveal className="mx-auto max-w-xl text-center">
          <span className="chip bg-blue-soft text-blue">
            <Sparkles className="size-3.5" /> Why choose us
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">
            The Snow Spoon difference
          </h2>
        </Reveal>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.06}>
              <div className="card h-full rounded-3xl p-6 text-center transition-shadow hover:shadow-lift">
                <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
