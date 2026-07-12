import type { Metadata } from "next";
import { getCategories, getMenuItems } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { OrderBuilder } from "@/components/order/OrderBuilder";
import { WHATSAPP_ORDER_NUMBER } from "@/lib/order";

export const metadata: Metadata = {
  title: "Order at your table",
  description: "Scan, tap and send your Snow Spoon order straight to the kitchen on WhatsApp.",
};

export const revalidate = 60;

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ table?: string }>;
}) {
  const sp = await searchParams;
  const table = sp.table?.trim() || null;

  const [items, categories] = await Promise.all([getMenuItems(), getCategories()]);
  const available = items.filter((i) => i.available);

  return (
    <>
      <PageHeader
        eyebrow="🧾 Order at your table"
        title="Build your order"
        subtitle="Tap to add what you'd like, then send it to us on WhatsApp — no waiting to flag someone down."
      />

      <section className="container-page pb-10">
        <OrderBuilder
          items={available}
          categories={categories}
          table={table}
          whatsappNumber={WHATSAPP_ORDER_NUMBER}
        />
      </section>
    </>
  );
}
