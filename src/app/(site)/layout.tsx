import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { StructuredData } from "@/components/site/StructuredData";
import { getRestaurant } from "@/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const restaurant = await getRestaurant();

  return (
    <div className="flex min-h-screen flex-col">
      <StructuredData restaurant={restaurant} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer restaurant={restaurant} />
    </div>
  );
}
