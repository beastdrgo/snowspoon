import type { Metadata } from "next";
import { getGallery } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { GalleryGrid } from "@/components/site/GalleryGrid";

export const metadata: Metadata = {
  title: "Gallery",
  description: "A feast for the eyes — browse photos of Snow Spoon's sundaes, shakes and desserts.",
};

export const revalidate = 60;

export default async function GalleryPage() {
  const images = await getGallery();

  return (
    <>
      <PageHeader
        eyebrow="📸 Our gallery"
        title="A feast for the eyes"
        subtitle="Every dessert is plated to delight. Tap any photo to take a closer look."
      />
      <section className="container-page pb-8">
        {images.length > 0 ? (
          <GalleryGrid images={images} />
        ) : (
          <p className="py-20 text-center text-muted">Gallery coming soon.</p>
        )}
      </section>
    </>
  );
}
