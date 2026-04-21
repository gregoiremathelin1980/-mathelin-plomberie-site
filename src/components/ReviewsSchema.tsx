import { SITE_URL } from "@/lib/config";
import type { ReviewEntry } from "@/lib/site-data";

interface ReviewsSchemaProps {
  reviews: ReviewEntry[];
}

/**
 * Avis structurés liés au LocalBusiness global (`@id` …/#localbusiness, défini dans le layout).
 * L’agrégat note / nombre d’avis GMB est porté par `LocalBusinessSchema` pour éviter les doublons.
 */
export default function ReviewsSchema({ reviews }: ReviewsSchemaProps) {
  if (!reviews?.length) return null;

  const businessId = `${SITE_URL}/#localbusiness`;

  const reviewSchemas = reviews.map((r) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@id": businessId },
    author: { "@type": "Person", name: r.author ?? "Client" },
    reviewRating: {
      "@type": "Rating",
      ratingValue: r.rating,
      bestRating: 5,
      worstRating: 1,
    },
    reviewBody: r.text,
    datePublished: r.date ?? undefined,
  }));

  return (
    <>
      {reviewSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
