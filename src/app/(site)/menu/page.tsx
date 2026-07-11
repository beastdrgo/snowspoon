import type { Metadata } from "next";
import Image from "next/image";
import { getCategories, getMenuItems, getRestaurant } from "@/lib/queries";
import { MenuExplorer } from "@/components/menu/MenuExplorer";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore the full Snow Spoon menu — signature sundaes, thick shakes, desserts, burgers, snacks and more. Made fresh, made for you.",
};

export const revalidate = 60;

export default async function MenuPage() {
  const [categories, items, restaurant] = await Promise.all([
    getCategories(),
    getMenuItems(),
    getRestaurant(),
  ]);

  return (
    <>
      {/* Hero header */}
      <header className="relative overflow-hidden">
        <div className="container-page relative grid items-center gap-8 py-10 md:grid-cols-2 md:py-16">
          <div>
            <span className="chip bg-brand-soft text-brand">🍨 Freshly made daily</span>
            <h1 className="heading-underline mt-4 font-display text-4xl font-extrabold text-ink sm:text-5xl md:text-6xl">
              {restaurant?.hero_title ?? "Our Menu"}
            </h1>
            <p className="mt-7 max-w-md text-base leading-relaxed text-ink-soft">
              {restaurant?.hero_subtitle ??
                "Scoops of joy in every bite. Made fresh, made for you."}
            </p>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-sm md:max-w-md">
            <div className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-brand-soft to-blue-soft blur-2xl" />
            <div className="relative h-full overflow-hidden rounded-[2.5rem] border-8 border-white shadow-lift">
              <Image
                src={restaurant?.hero_image ?? "/images/dessert-platter.jpeg"}
                alt="Snow Spoon signature dessert"
                fill
                priority
                sizes="(max-width: 768px) 90vw, 440px"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      <MenuExplorer categories={categories} items={items} />
    </>
  );
}
