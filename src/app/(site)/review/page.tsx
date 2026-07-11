import type { Metadata } from "next";
import { getMenuItems } from "@/lib/queries";
import { PageHeader } from "@/components/site/PageHeader";
import { ReviewBuilder } from "@/components/review/ReviewBuilder";

export const metadata: Metadata = {
  title: "Leave a Review",
  description:
    "Loved your visit to Snow Spoon? Answer a few quick questions and we'll help you write a Google review in seconds.",
};

export const revalidate = 60;

// Direct Google "write a review" deep link for the Snow Spoon Puttur listing.
const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=ChIJpUK1MQC9pDsRMitcp-SLrQ0";

export default async function ReviewPage() {
  const items = await getMenuItems();
  // Offer the most relevant dishes as quick-pick chips.
  const names = items
    .filter((i) => i.available)
    .sort((a, b) => (a.popular === b.popular ? a.sort_order - b.sort_order : a.popular ? -1 : 1))
    .slice(0, 12)
    .map((i) => i.name);

  return (
    <>
      <PageHeader
        eyebrow="⭐ Share the love"
        title="Leave us a review"
        subtitle="Enjoyed your scoops? Answer a few quick questions and we'll draft a Google review for you — copy, paste, done in seconds."
      />

      <section className="container-page pb-16">
        <ReviewBuilder menuItems={names} reviewUrl={GOOGLE_REVIEW_URL} />

        <p className="mx-auto mt-6 max-w-md text-center text-xs leading-relaxed text-muted">
          Your review is generated from your own answers — please edit it to reflect your honest
          experience before posting. 💛
        </p>
      </section>
    </>
  );
}
